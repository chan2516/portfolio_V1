import request from 'supertest';
import app, { databaseReady } from '../server.js';
import sequelize from '../db.js';
import Project from '../models/Project.js';

const admin = request.agent(app);
beforeAll(async () => {
  await databaseReady;
  // Only the isolated in-memory test database is reset.
  await sequelize.sync({ force: true });
  await request(app).post('/api/auth/setup').send({ username: 'test-owner', password: 'test-owner-password' }).expect(201);
  await admin.post('/api/auth/login').send({ username: 'test-owner', password: 'test-owner-password' }).expect(200);
});

afterAll(async () => {
  // Clean up and close connection
  await sequelize.close();
});

beforeEach(async () => {
  // Clear collections before each test
  await Project.destroy({ where: {} });
});

describe('Projects API', () => {
  const mockProject = {
    id: 'test-project',
    title: 'Test Project',
    summary: 'A summary for testing',
    techStack: ['React', 'Node.js']
  };

  test('GET /api/projects should return empty array initially', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/projects should create a new project', async () => {
    const res = await admin
      .post('/api/projects')
      .send(mockProject);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(mockProject.title);
    expect(res.body.id).toBe(mockProject.id);
  });

  test('SQL fragments in IDs cannot select or update a different project', async () => {
    await admin.post('/api/projects').send(mockProject).expect(201);
    const injectedId = encodeURIComponent("' OR 1=1; DROP TABLE Projects; --");
    await request(app).get('/api/projects/' + injectedId).expect(404);
    await admin.put('/api/projects/' + injectedId).send({ title: 'Changed' }).expect(404);
    const saved = await Project.findByPk(mockProject.id);
    expect(saved.title).toBe(mockProject.title);
    expect(await Project.count()).toBe(1);
  });
});
