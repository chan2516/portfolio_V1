import express from 'express';
import request from 'supertest';
import { Sequelize } from 'sequelize';
import { createAuth } from '../auth.js';
import { migrateUsers } from '../migrateUsers.js';
import { validLinks } from '../validateLinks.js';
import { mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

function makeApp(auth) {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', auth.router);
  app.use('/api', auth.protectWrites);
  app.get('/api/content', (req, res) => res.json({ public: true }));
  app.put('/api/content', (req, res) => res.json({ saved: true }));
  return app;
}
let db, auth, app;
const credentials = { username: 'owner', password: 'a-long-test-password' };
beforeEach(async () => {
  db = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
  auth = createAuth(db); app = makeApp(auth);
  await db.sync(); await request(app).post('/api/auth/setup').send(credentials).expect(201);
});
afterEach(async () => { await db.close(); });

test('public reads and protected writes, login, origin checks and logout', async () => {
  expect((await request(app).get('/api/content')).status).toBe(200);
  expect((await request(app).put('/api/content')).status).toBe(401);
  expect((await request(app).post('/api/auth/login').send({ username: 'owner', password: 'wrong' })).status).toBe(401);
  expect((await request(app).get('/api/auth/users')).status).toBe(401);
  const agent = request.agent(app);
  const login = await agent.post('/api/auth/login').send(credentials);
  expect(login.status).toBe(200);
  expect(login.headers['set-cookie'][0]).toContain('HttpOnly');
  expect((await agent.get('/api/auth/session')).body.user.role).toBe('owner');
  expect((await agent.put('/api/content')).status).toBe(200);
  expect((await agent.put('/api/content').set('Origin', 'https://untrusted.example')).status).toBe(403);
  expect((await agent.post('/api/auth/login').set('Origin', 'https://untrusted.example').send(credentials)).status).toBe(403);
  await agent.post('/api/auth/logout');
  expect((await agent.put('/api/content')).status).toBe(401);
});

test('browser-facing hosts pass origin checks without trusting forwarded host headers', async () => {
  for (const host of ['localhost:3000', '127.0.0.1:3000', '192.168.1.10:3001']) {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').set('Host', host).set('Origin', 'http://' + host).send(credentials).expect(200);
    await agent.put('/api/content').set('Host', host).set('Origin', 'http://' + host).expect(200);
    await agent.post('/api/auth/logout').set('Host', host).set('Origin', 'https://untrusted.example').set('X-Forwarded-Host', 'untrusted.example').set('X-Forwarded-Proto', 'https').expect(403);
    await agent.post('/api/auth/logout').set('Host', host).set('Origin', 'null').expect(403);
  }
});

test('owner creates multiple admins with hashed passwords and admins cannot manage accounts', async () => {
  const owner = request.agent(app); await owner.post('/api/auth/login').send(credentials);
  await owner.post('/api/auth/users').send({ username: 'Colleague', password: 'colleague-password', role: 'owner' }).expect(400);
  const created = await owner.post('/api/auth/users').send({ username: 'Colleague', password: 'colleague-password' });
  expect(created.status).toBe(201); expect(created.body.role).toBe('admin'); expect(created.body.username).toBe('colleague');
  expect(created.body.passwordHash).toBeUndefined();
  expect((await auth.User.findByPk(created.body.id)).passwordHash).not.toBe('colleague-password');
  expect((await owner.post('/api/auth/users').send({ username: 'COLLEAGUE', password: 'another-password' })).status).toBe(409);
  expect((await owner.post('/api/auth/users').send({ username: 'other', password: 'short' })).status).toBe(400);
  expect((await owner.post('/api/auth/users').send({ username: 'other', password: 'another-password' })).status).toBe(201);
  const colleague = request.agent(app); await colleague.post('/api/auth/login').send({ username: 'colleague', password: 'colleague-password' }).expect(200);
  expect((await colleague.put('/api/content')).status).toBe(200);
  expect((await colleague.get('/api/auth/users')).status).toBe(403);
  expect((await colleague.post('/api/auth/users').send({ username: 'intruder', password: 'another-password' })).status).toBe(403);
  expect((await colleague.patch('/api/auth/users/' + created.body.id).send({ active: false })).status).toBe(403);
  const list = await owner.get('/api/auth/users'); expect(list.body).toHaveLength(3);
  expect(list.body.every(user => !('passwordHash' in user))).toBe(true);
  const ownerId = list.body.find(user => user.role === 'owner').id;
  expect((await owner.patch('/api/auth/users/' + ownerId).send({ active: false })).status).toBe(400);
});

test('disabling and resetting passwords revoke sessions, and expired sessions cannot write', async () => {
  const owner = request.agent(app); await owner.post('/api/auth/login').send(credentials);
  const user = (await owner.post('/api/auth/users').send({ username: 'editor', password: 'editor-password' })).body;
  const editor = request.agent(app); await editor.post('/api/auth/login').send({ username: 'editor', password: 'editor-password' });
  await owner.patch('/api/auth/users/' + user.id).send({ active: false }).expect(200);
  expect((await editor.put('/api/content')).status).toBe(401);
  expect((await editor.post('/api/auth/login').send({ username: 'editor', password: 'editor-password' })).status).toBe(401);
  await owner.patch('/api/auth/users/' + user.id).send({ active: true });
  await editor.post('/api/auth/login').send({ username: 'editor', password: 'editor-password' }).expect(200);
  await owner.patch('/api/auth/users/' + user.id).send({ password: 'replacement-password' }).expect(200);
  expect((await editor.put('/api/content')).status).toBe(401);
  expect((await editor.post('/api/auth/login').send({ username: 'editor', password: 'editor-password' })).status).toBe(401);
  await editor.post('/api/auth/login').send({ username: 'editor', password: 'replacement-password' }).expect(200);
  await auth.Session.update({ expiresAt: new Date(0) }, { where: { userId: user.id } });
  expect((await editor.put('/api/content')).status).toBe(401);
});

test('accounts and sessions survive closing and reopening the SQLite database', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'devfolio-auth-test-'));
  const storage = path.join(directory, 'auth.sqlite');
  let persistent;
  try {
    persistent = new Sequelize({ dialect: 'sqlite', storage, logging: false });
    let instance = createAuth(persistent); await persistent.sync(); await request(makeApp(instance)).post('/api/auth/setup').send(credentials).expect(201);
    const response = await request(makeApp(instance)).post('/api/auth/login').send(credentials).expect(200);
    const sessionCookie = response.headers['set-cookie'][0].split(';')[0];
    const rawToken = sessionCookie.split('=')[1];
    expect((await instance.Session.findOne()).tokenHash).not.toBe(rawToken);
    // Simulate the previous account-table name, including its session foreign key.
    await persistent.getQueryInterface().renameTable('Users', 'AdminUsers');
    await persistent.close();
    persistent = new Sequelize({ dialect: 'sqlite', storage, logging: false });
    instance = createAuth(persistent); await migrateUsers(persistent); await persistent.sync();
    // Reopening the database requires no environment credentials.
    expect(await instance.User.count()).toBe(1);
    expect(await persistent.getQueryInterface().showAllTables()).toContain('Users');
    expect(await persistent.getQueryInterface().showAllTables()).not.toContain('AdminUsers');
    const reopened = makeApp(instance);
    expect((await request(reopened).get('/api/auth/session').set('Cookie', sessionCookie)).body.authenticated).toBe(true);
    await request(reopened).post('/api/auth/login').send(credentials).expect(200);
  } finally {
    if (persistent) await persistent.close();
    if (!path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep)) throw Error('Unexpected test directory');
    await rm(directory, { recursive: true, force: true });
  }
});

test('repeated failed sign-ins are rate limited', async () => {
  for (let i = 0; i < 5; i++) await request(app).post('/api/auth/login').send({ username: 'owner', password: 'invalid-password' }).expect(401);
  await request(app).post('/api/auth/login').send(credentials).expect(429);
});

test('first-owner setup needs no environment credentials and closes once an account exists', async () => {
  await auth.Session.destroy({ where: {} });
  await auth.User.destroy({ where: {} });
  expect((await request(app).get('/api/auth/session')).body.needsSetup).toBe(true);
  await request(app).post('/api/auth/setup').send({ username: 'owner', password: 'short' }).expect(400);
  await request(app).post('/api/auth/setup').set('Origin', 'https://untrusted.example').send(credentials).expect(403);
  const owner = request.agent(app);
  await owner.post('/api/auth/setup').send(credentials).expect(201);
  expect((await owner.get('/api/auth/session')).body.authenticated).toBe(true);
  expect((await owner.get('/api/auth/session')).body.needsSetup).toBe(false);
  await request(app).post('/api/auth/setup').send({ username: 'second-owner', password: 'another-password' }).expect(409);
  expect(await auth.User.count()).toBe(1);
});

test('users change their own credentials using the current password and revoke other sessions', async () => {
  const first = request.agent(app); const second = request.agent(app);
  await first.post('/api/auth/login').send(credentials).expect(200);
  await second.post('/api/auth/login').send(credentials).expect(200);
  await first.patch('/api/auth/account').send({ username: 'new-owner', currentPassword: 'wrong-password', password: 'new-owner-password' }).expect(401);
  await first.patch('/api/auth/account').send({ username: 'new-owner', currentPassword: credentials.password, password: 'new-owner-password' }).expect(200);
  expect((await first.get('/api/auth/session')).body.user.username).toBe('new-owner');
  expect((await second.put('/api/content')).status).toBe(401);
  await request(app).post('/api/auth/login').send(credentials).expect(401);
  await request(app).post('/api/auth/login').send({ username: 'new-owner', password: 'new-owner-password' }).expect(200);
});

test('links permit blank and web URLs and reject unsafe URLs', () => {
  expect(validLinks({ githubUrl: '', companyUrl: 'https://example.com', workUrl: 'http://example.com/work' })).toBe(true);
  for (const url of ['javascript:alert(1)', 'example.com', 'https://user:password@example.com', 'https://example.com/a b']) expect(validLinks({ githubUrl: url })).toBe(false);
});

test('SQL injection and operator payloads cannot bypass credentials or change user data', async () => {
  const payloads = [
    { username: "owner' OR '1'='1' --", password: credentials.password },
    { username: "'; DROP TABLE Users; --", password: credentials.password },
    { username: { $ne: null }, password: credentials.password },
    { username: ['owner'], password: credentials.password },
    { username: 'owner', password: { $ne: null } },
    { username: 'owner', password: "' OR 1=1; --" },
    { username: 'owner', password: 'x'.repeat(1025) },
  ];
  for (const payload of payloads) {
    const attacker = request.agent(app);
    await attacker.post('/api/auth/login').send(payload).expect(401);
    expect((await attacker.get('/api/auth/session')).body.authenticated).toBe(false);
    expect(await auth.User.count()).toBe(1);
    // Legitimate credentials still work, and reset the failure counter.
    await request(app).post('/api/auth/login').send(credentials).expect(200);
  }
  await request(app).post('/api/auth/login').send({ ...credentials, role: 'owner' }).expect(400);
});

test('user updates reject injected IDs, credential objects and privilege escalation', async () => {
  const owner = request.agent(app); await owner.post('/api/auth/login').send(credentials);
  const created = await owner.post('/api/auth/users').send({ username: 'editor', password: 'editor-password' });
  const id = created.body.id;
  await owner.patch('/api/auth/users/' + encodeURIComponent("' OR 1=1 --")).send({ active: false }).expect(400);
  await owner.patch('/api/auth/users/' + id).send({ role: 'owner' }).expect(400);
  await owner.patch('/api/auth/users/' + id).send({ password: { $ne: null } }).expect(400);
  await owner.patch('/api/auth/account').send({ username: "owner'; DELETE FROM Users; --", currentPassword: credentials.password }).expect(400);
  const unchanged = await auth.User.findByPk(id);
  expect(unchanged.active).toBe(true); expect(unchanged.role).toBe('admin');
  expect(await auth.User.count()).toBe(2);
});

test('owner edits a user login, preserves password when omitted, and duplicate names cannot overwrite accounts', async () => {
  const owner = request.agent(app); await owner.post('/api/auth/login').send(credentials);
  const created = await owner.post('/api/auth/users').send({ username: 'editor', password: 'editor-password' });
  const id = created.body.id;
  await owner.patch('/api/auth/users/' + id).send({ username: 'OWNER' }).expect(409);
  expect((await auth.User.findByPk(id)).username).toBe('editor');
  await owner.patch('/api/auth/users/' + id).send({ username: 'renamed-editor' }).expect(200);
  await request(app).post('/api/auth/login').send({ username: 'renamed-editor', password: 'editor-password' }).expect(200);
  await request(app).post('/api/auth/login').send({ username: 'editor', password: 'editor-password' }).expect(401);
});

test('migration repairs sessions when both legacy and new user tables exist', async () => {
  const login = await request(app).post('/api/auth/login').send(credentials).expect(200);
  const sessionCookie = login.headers['set-cookie'][0].split(';')[0];
  await db.getQueryInterface().renameTable('Users', 'AdminUsers');
  await auth.User.sync(); // Simulate a hot reload that created an empty new table.
  await migrateUsers(db);
  expect(await auth.User.count()).toBe(1);
  expect(await db.getQueryInterface().showAllTables()).not.toContain('AdminUsers');
  expect((await request(app).get('/api/auth/session').set('Cookie', sessionCookie)).body.authenticated).toBe(true);
  await request(app).post('/api/auth/login').send(credentials).expect(200);
});

test('current-password guessing is rate limited without changing the account', async () => {
  const owner = request.agent(app); await owner.post('/api/auth/login').send(credentials);
  for (let i = 0; i < 5; i++) await owner.patch('/api/auth/account').send({ username: 'renamed-owner', currentPassword: 'incorrect-password' }).expect(401);
  const blocked = await owner.patch('/api/auth/account').send({ username: 'renamed-owner', currentPassword: credentials.password }).expect(429);
  expect(blocked.headers['retry-after']).toBeDefined();
  expect((await auth.User.findOne()).username).toBe('owner');
});
