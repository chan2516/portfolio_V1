import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import Setting from '../models/Setting.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Theme from '../models/Theme.js';

export const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public/uploads'));
const types = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif', pdf: 'application/pdf' };
export function detectType(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg';
  if (['GIF87a', 'GIF89a'].includes(bytes.toString('ascii', 0, 6))) return 'gif';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (bytes.toString('ascii', 4, 8) === 'ftyp' && ['avif', 'avis'].includes(bytes.toString('ascii', 8, 12))) return 'avif';
  if (bytes.toString('ascii', 0, 5) === '%PDF-') return 'pdf';
  return null;
}

export function createMediaRouter(directory = uploadDir, { isReferenced = async () => false } = {}) {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1 } });
  router.get('/', async (req, res) => {
    try {
      await fs.mkdir(directory, { recursive: true });
      const entries = await fs.readdir(directory, { withFileTypes: true });
      const files = await Promise.all(entries.filter(entry => entry.isFile() && /\.(png|jpe?g|webp|gif|avif|pdf)$/i.test(entry.name)).map(async entry => {
        const stat = await fs.stat(path.join(directory, entry.name));
        let metadata = {}; try { metadata = JSON.parse(await fs.readFile(path.join(directory, entry.name + '.json'), 'utf8')); } catch {}
        const extension = path.extname(entry.name).slice(1).toLowerCase();
        return { id: entry.name, url: '/uploads/' + encodeURIComponent(entry.name), filename: metadata.filename || entry.name, size: stat.size, type: types[extension === 'jpeg' ? 'jpg' : extension], createdAt: stat.birthtime.toISOString() };
      }));
      res.json(files.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch { res.status(500).json({ message: 'Could not read the local media library.' }); }
  });
  router.post('/upload', (req, res) => {
    upload.single('file')(req, res, async error => {
      if (error) return res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'File is too large. Maximum size is 10 MB.' : 'Upload one file at a time using the file field.' });
      if (!req.file) return res.status(400).json({ message: 'Choose a file to upload.' });
      const type = detectType(req.file.buffer);
      if (!type || req.file.mimetype !== types[type]) return res.status(415).json({ message: 'Upload a PNG, JPEG, WebP, GIF, AVIF image or PDF document.' });
      const id = randomUUID() + '.' + type;
      try {
        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(path.join(directory, id), req.file.buffer, { flag: 'wx' });
        await fs.writeFile(path.join(directory, id + '.json'), JSON.stringify({ filename: path.basename(req.file.originalname).slice(0, 200) }));
        res.status(201).json({ id, url: '/uploads/' + id, filename: req.file.originalname, size: req.file.size, type: types[type], createdAt: new Date().toISOString() });
      } catch { await fs.unlink(path.join(directory, id)).catch(() => {}); res.status(500).json({ message: 'Could not save the upload. Check local disk permissions and free space.' }); }
    });
  });
  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!/^[\w-]+\.(png|jpe?g|webp|gif|avif|pdf)$/i.test(id)) return res.status(400).json({ message: 'Invalid media file ID.' });
    const root = path.resolve(directory);
    const filename = path.resolve(root, id);
    if (path.dirname(filename) !== root) return res.status(400).json({ message: 'Invalid media path.' });
    try {
      const stat = await fs.lstat(filename);
      if (!stat.isFile() || stat.isSymbolicLink()) return res.status(400).json({ message: 'Only uploaded media files can be deleted.' });
      if (await isReferenced('/uploads/' + encodeURIComponent(id))) return res.status(409).json({ message: 'This file is used by the published website. Replace or remove it in the editor and publish before deleting it.' });
      await fs.unlink(filename);
      await fs.unlink(filename + '.json').catch(error => { if (error.code !== 'ENOENT') throw error; });
      res.json({ message: 'Media file deleted.', id });
    } catch (error) {
      if (error.code === 'ENOENT') return res.status(404).json({ message: 'Media file not found.' });
      res.status(500).json({ message: 'Could not delete this file. Please try again.' });
    }
  });
  return router;
}
function containsUrl(value, url) {
  if (typeof value === 'string') return value.includes(url);
  if (Array.isArray(value)) return value.some(item => containsUrl(item, url));
  if (value && typeof value === 'object') return Object.values(value).some(item => containsUrl(item, url));
  return false;
}
export default createMediaRouter(uploadDir, { isReferenced: async url => {
  const records = await Promise.all([Setting.findAll(), Project.findAll(), Experience.findAll(), Theme.findAll()]);
  return records.flat().some(record => containsUrl(record.toJSON(), url));
} });
