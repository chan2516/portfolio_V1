import request from 'supertest';
import app, { databaseReady } from '../server.js';
import sequelize from '../db.js';
import Setting from '../models/Setting.js';

const owner = request.agent(app);
const editor = request.agent(app);
const config = () => ({
  version: 1,
  theme: { accent: '#6366f1', background: '#09090b', text: '#ffffff', font: 'Arial, sans-serif', radius: 16, width: 1280, dark: true },
  sections: [{ id: 'hero', type: 'hero', label: 'Hero', visible: true, title: '', body: '', image: '', link: '', background: '', padding: 0, align: 'left' }],
  content: { candidateInfo: {}, contactData: {}, projectsData: [], experienceData: [], candidateStats: [], skillGroups: [], educationData: [], certificationsData: [], sampleCodeSnippets: [] },
});
beforeAll(async () => {
  await databaseReady;
  await owner.post('/api/auth/setup').send({ username: 'settings-owner', password: 'settings-owner-password' }).expect(201);
  await owner.post('/api/auth/users').send({ username: 'settings-editor', password: 'settings-editor-password' }).expect(201);
  await editor.post('/api/auth/login').send({ username: 'settings-editor', password: 'settings-editor-password' }).expect(200);
});
beforeEach(async () => { await Setting.destroy({ where: {} }); });
afterAll(async () => { await sequelize.close(); });

test('two users can publish, but an outdated draft cannot overwrite a newer version', async () => {
  const initial = config();
  const first = await owner.put('/api/settings/portfolio').set('If-None-Match', '*').send(initial).expect(200);
  const ownerRead = await owner.get('/api/settings/portfolio').expect(200);
  const editorRead = await editor.get('/api/settings/portfolio').expect(200);
  expect(ownerRead.headers.etag).toBe(first.headers.etag);
  expect(editorRead.headers.etag).toBe(first.headers.etag);
  const updated = { ...initial, theme: { ...initial.theme, font: 'Georgia, serif', headingFont: 'Arial, sans-serif', bodySize: 18, lineHeight: 1.8 } };
  const published = await editor.put('/api/settings/portfolio').set('If-Match', editorRead.headers.etag).send(updated).expect(200);
  expect(published.headers.etag).not.toBe(first.headers.etag);
  await owner.put('/api/settings/portfolio').set('If-Match', ownerRead.headers.etag).send({ ...initial, theme: { ...initial.theme, radius: 20 } }).expect(412);
  const final = await owner.get('/api/settings/portfolio');
  expect(final.body.theme.font).toBe('Georgia, serif');
  expect(final.body.theme.radius).toBe(16);
});

test('publishing requires a revision and reports invalid link fields', async () => {
  await owner.put('/api/settings/portfolio').send(config()).expect(428);
  const invalid = config(); invalid.content.projectsData = [{ id: 'test', title: 'Test', githubUrl: 'TEST' }];
  const response = await owner.put('/api/settings/portfolio').set('If-None-Match', '*').send(invalid).expect(400);
  expect(response.body.message).toContain('content.projectsData[0].githubUrl');
  expect(await Setting.count()).toBe(0);
});

test('published links, image dimensions and global typography survive saving and reloading', async () => {
  const value = config();
  value.content.contactData.websiteUrl = 'https://example.com';
  value.content.projectsData = [{ id: 'example', title: 'Example', githubUrl: 'https://github.com/example/repo', liveUrl: 'https://example.com/app' }];
  value.content.experienceData = [{ id: 'job', companyUrl: 'https://example.com/company', workUrl: 'https://example.com/work' }];
  value.images = { profile: { src: '/uploads/test.png', alt: 'Portrait', width: 280, height: 400, radius: 12, fit: 'contain', position: 'top', align: 'left' } };
  value.theme = { ...value.theme, headingFont: 'Georgia, serif', bodySize: 18, lineHeight: 1.8 };
  await owner.put('/api/settings/portfolio').set('If-None-Match', '*').send(value).expect(200);
  const read = await request(app).get('/api/settings/portfolio').expect(200);
  expect(read.body).toEqual(value);
});
