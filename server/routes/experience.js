import express from 'express';
import Experience from '../models/Experience.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.findAll();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newExp = await Experience.create(req.body);
    res.status(201).json(newExp);
  } catch (error) {
    res.status(400).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const exp = await Experience.findByPk(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    await exp.update(req.body);
    res.json(exp);
  } catch (error) {
    res.status(400).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const exp = await Experience.findByPk(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    await exp.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

export default router;
