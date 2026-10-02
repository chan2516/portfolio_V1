import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createMediaRouter } from '../routes/media.js';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5WQAAAAASUVORK5CYII=', 'base64');
test('uploads locally, lists saved media, and serves the uploaded bytes', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'devfolio-media-test-'));
  const app = express(); app.use('/api/media', createMediaRouter(directory)); app.use('/uploads', express.static(directory));
  try {
    const uploaded = await request(app).post('/api/media/upload').attach('file', png, { filename: 'portrait.png', contentType: 'image/png' }).expect(201);
    assert.match(uploaded.body.url, /^\/uploads\/[\w-]+\.png$/);
    const list = await request(app).get('/api/media').expect(200);
    assert.equal(list.body[0].filename, 'portrait.png'); assert.equal(list.body[0].url, uploaded.body.url);
    const image = await request(app).get(uploaded.body.url).expect(200).expect('Content-Type', /image\/png/);
    assert.deepEqual(image.body, png);
    await request(app).post('/api/media/upload').attach('file', Buffer.from('<script>alert(1)</script>'), { filename: 'fake.png', contentType: 'image/png' }).expect(415);
    await request(app).post('/api/media/upload').expect(400);
    const after = await request(app).get('/api/media').expect(200); assert.equal(after.body.length, 1);
  } finally {
    const resolved = path.resolve(directory); assert.ok(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep));
    await fs.rm(resolved, { recursive: true, force: true });
  }
});
test('rejects oversized uploads without saving media', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'devfolio-media-test-'));
  const app = express(); app.use('/api/media', createMediaRouter(directory));
  try {
    const response = await request(app).post('/api/media/upload').attach('file', Buffer.alloc(10 * 1024 * 1024 + 1), { filename: 'large.png', contentType: 'image/png' }).expect(400);
    assert.match(response.body.message, /10 MB/); assert.equal((await fs.readdir(directory)).length, 0);
  } finally {
    const resolved = path.resolve(directory); assert.ok(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep)); await fs.rm(resolved, { recursive: true, force: true });
  }
});

test('deletes an uploaded file and metadata, protects referenced files, and rejects invalid paths', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'devfolio-media-test-'));
  let referenced = true;
  const app = express(); app.use('/api/media', createMediaRouter(directory, { isReferenced: async () => referenced }));
  try {
    const uploaded = await request(app).post('/api/media/upload').attach('file', png, { filename: 'test.png', contentType: 'image/png' }).expect(201);
    const id = uploaded.body.id;
    await request(app).delete('/api/media/' + id).expect(409);
    assert.equal((await fs.readdir(directory)).length, 2);
    await request(app).delete('/api/media/' + encodeURIComponent('../outside.png')).expect(400);
    await request(app).delete('/api/media/' + encodeURIComponent('..\\outside.png')).expect(400);
    referenced = false;
    await request(app).delete('/api/media/' + id).expect(200);
    assert.deepEqual(await fs.readdir(directory), []);
    await request(app).delete('/api/media/' + id).expect(404);
  } finally {
    const resolved = path.resolve(directory); assert.ok(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep));
    await fs.rm(resolved, { recursive: true, force: true });
  }
});
