import express from 'express';
import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { Op, Transaction } from 'sequelize';
import sequelize from './db.js';
import { defineAdminModels } from './models/Admin.js';

const derive = promisify(scrypt);
const digest = token => createHash('sha256').update(token).digest('hex');
const usernameOf = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
const validUsername = value => /^[a-z0-9][a-z0-9._-]{2,63}$/.test(value);
const validPassword = value => typeof value === 'string' && value.length >= 12 && value.length <= 1024;
const dummyHash = `${'0'.repeat(32)}:${'0'.repeat(128)}`;
const publicUser = user => ({ id: user.id, username: user.username, role: user.role, active: user.active });
async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${(await derive(password, salt, 64)).toString('hex')}`;
}
async function matches(password, hash) {
  if (typeof hash !== 'string' || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash)) return false;
  const [salt, key] = hash.split(':');
  return timingSafeEqual(await derive(password, salt, 64), Buffer.from(key, 'hex'));
}

export function createAuth(db) {
  const { User, Session } = defineAdminModels(db);
  const router = express.Router();
  const attempts = new Map();
  const lifetime = 8 * 60 * 60 * 1000;
  function recordAttempt(key, res) {
    const now = Date.now();
    for (const [id, value] of attempts) if (value.until <= now) attempts.delete(id);
    const attempt = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
    if (attempt.count >= 5) {
      res.set('Retry-After', String(Math.ceil((attempt.until - now) / 1000)));
      res.status(429).json({ message: 'Too many attempts. Try again in 15 minutes.' });
      return false;
    }
    attempt.count++; attempts.set(key, attempt);
    return true;
  }
  // Allowlist request fields and types before they reach the ORM. Never accept
  // database operators, query fragments, or caller-supplied roles/IDs as credentials.
  const bodyShape = keys => (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(key => !keys.includes(key))) return res.status(400).json({ message: 'Invalid account request fields.' });
    next();
  };
  const cookieName = 'portfolio_session';
  const tokenOf = req => req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  const cookie = (res, token, maxAge) => res.cookie(cookieName, token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge, path: '/' });
  const handle = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
  async function signedIn(req) {
    const token = tokenOf(req);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const session = await Session.findByPk(digest(token));
    if (!session || session.expiresAt.getTime() <= Date.now()) return null;
    const user = await User.findByPk(session.userId);
    return user?.active ? user : null;
  }
  function checkOrigin(req, res, next) {
    if (req.headers.origin && req.headers.origin !== `${req.protocol}://${req.get('host')}` && req.headers.origin !== process.env.ADMIN_ORIGIN) return res.status(403).json({ message: 'Untrusted request origin.' });
    next();
  }
  const requireUser = handle(async (req, res, next) => {
    req.adminUser = await signedIn(req);
    if (!req.adminUser) return res.status(401).json({ message: 'Sign in to edit the portfolio.' });
    next();
  });
  const requireOwner = (req, res, next) => req.adminUser.role === 'owner' ? next() : res.status(403).json({ message: 'Only the owner can manage admin accounts.' });
  async function startSession(req, res, user) {
    const oldToken = tokenOf(req);
    if (oldToken) await Session.destroy({ where: { tokenHash: digest(oldToken) } });
    const token = randomBytes(32).toString('hex');
    await Session.create({ tokenHash: digest(token), userId: user.id, expiresAt: new Date(Date.now() + lifetime) });
    cookie(res, token, lifetime);
  }
  router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.use((req, res, next) => ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? next() : checkOrigin(req, res, next));
  router.get('/session', handle(async (req, res) => { const user = await signedIn(req); res.json({ authenticated: Boolean(user), user: user ? publicUser(user) : null, needsSetup: await User.count() === 0 }); }));
  router.post('/setup', bodyShape(['username', 'password']), handle(async (req, res) => {
    if (await User.count()) return res.status(409).json({ message: 'An owner account already exists. Sign in to manage admin accounts.' });
    const username = usernameOf(req.body?.username);
    if (!validUsername(username) || !validPassword(req.body?.password)) return res.status(400).json({ message: 'Choose a username of 3–64 letters, numbers, dots, underscores or hyphens and a password of at least 12 characters.' });
    const passwordHash = await hashPassword(req.body.password);
    const user = await db.transaction({ type: Transaction.TYPES.IMMEDIATE }, async transaction => {
      if (await User.count({ transaction })) return null;
      return User.create({ username, passwordHash, role: 'owner' }, { transaction });
    });
    if (!user) return res.status(409).json({ message: 'An owner account already exists. Sign in to manage admin accounts.' });
    await startSession(req, res, user);
    res.status(201).json({ authenticated: true, user: publicUser(user) });
  }));
  router.post('/login', bodyShape(['username', 'password']), handle(async (req, res) => {
    const key = 'login:' + req.ip;
    if (!recordAttempt(key, res)) return;
    const username = usernameOf(req.body?.username);
    const password = req.body?.password;
    if (!validUsername(username) || !validPassword(password)) return res.status(401).json({ message: 'Incorrect username or password.' });
    const user = await User.findOne({ where: { username } });
    const passwordMatches = await matches(password, user?.passwordHash || dummyHash);
    if (!user?.active || !passwordMatches) return res.status(401).json({ message: 'Incorrect username or password.' });
    attempts.delete(key);
    await Session.destroy({ where: { expiresAt: { [Op.lte]: new Date() } } });
    await startSession(req, res, user);
    res.json({ authenticated: true, user: publicUser(user) });
  }));
  router.post('/logout', handle(async (req, res) => { const token = tokenOf(req); if (token) await Session.destroy({ where: { tokenHash: digest(token) } }); cookie(res, '', 0); res.json({ authenticated: false }); }));
  router.patch('/account', requireUser, bodyShape(['username', 'currentPassword', 'password']), handle(async (req, res) => {
    const user = req.adminUser;
    const attemptKey = 'account:' + req.ip + ':' + user.id;
    if (!recordAttempt(attemptKey, res)) return;
    const { currentPassword, password } = req.body || {};
    const username = usernameOf(req.body?.username);
    if (!validPassword(currentPassword) || !await matches(currentPassword, user.passwordHash)) return res.status(401).json({ message: 'Current password is incorrect.' });
    attempts.delete(attemptKey);
    if (!validUsername(username) || (password !== undefined && !validPassword(password))) return res.status(400).json({ message: 'Enter a valid username and a new password of at least 12 characters, or leave the new password blank.' });
    try {
      await db.transaction(async transaction => {
        await user.update({ username, ...(password !== undefined ? { passwordHash: await hashPassword(password) } : {}) }, { transaction });
        await Session.destroy({ where: { userId: user.id }, transaction });
      });
    } catch (error) { if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'Username is already in use.' }); throw error; }
    await startSession(req, res, user);
    res.json({ authenticated: true, user: publicUser(user) });
  }));
  router.get('/users', requireUser, requireOwner, handle(async (req, res) => res.json((await User.findAll({ order: [['createdAt', 'ASC']] })).map(publicUser))));
  router.post('/users', requireUser, requireOwner, bodyShape(['username', 'password']), handle(async (req, res) => {
    const username = usernameOf(req.body?.username);
    if (!validUsername(username) || !validPassword(req.body?.password)) return res.status(400).json({ message: 'Use a username of 3–64 letters, numbers, dots, underscores or hyphens and a password of 12–1024 characters.' });
    try {
      const user = await User.create({ username, passwordHash: await hashPassword(req.body.password), role: 'admin' });
      res.status(201).json(publicUser(user));
    } catch (error) { if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'Username is already in use.' }); throw error; }
  }));
  router.patch('/users/:id', requireUser, requireOwner, bodyShape(['username', 'active', 'password']), handle(async (req, res) => {
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(req.params.id)) return res.status(400).json({ message: 'Invalid user ID.' });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'owner') return res.status(400).json({ message: 'The owner account cannot be changed here.' });
    const { active, password, username: inputUsername } = req.body || {};
    const username = inputUsername === undefined ? undefined : usernameOf(inputUsername);
    if ((username !== undefined && !validUsername(username)) || (active !== undefined && typeof active !== 'boolean') || (password !== undefined && !validPassword(password)) || (active === undefined && password === undefined && username === undefined)) return res.status(400).json({ message: 'Provide a valid username, an active status or a password of at least 12 characters.' });
    try {
      await db.transaction(async transaction => {
        await user.update({ ...(username !== undefined ? { username } : {}), ...(active !== undefined ? { active } : {}), ...(password !== undefined ? { passwordHash: await hashPassword(password) } : {}) }, { transaction });
        await Session.destroy({ where: { userId: user.id }, transaction });
      });
    } catch (error) { if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'Username is already in use.' }); throw error; }
    res.json(publicUser(user));
  }));
  router.use((error, req, res, next) => {
    console.error('Admin authentication error:', error.name);
    res.status(500).json({ message: 'Could not complete the account request. Please try again.' });
  });
  const protectWrites = (req, res, next) => ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? next() : checkOrigin(req, res, () => requireUser(req, res, next));
  return { router, protectWrites, User, Session };
}

const auth = createAuth(sequelize);
export const authRouter = auth.router;
export const protectWrites = auth.protectWrites;
