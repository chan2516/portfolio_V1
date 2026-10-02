import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

// GET one project by id (string ID from data)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

// POST new project
router.post('/', async (req, res) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

export default router;
