import express from 'express';
import Theme from '../models/Theme.js';

const router = express.Router();

// GET active theme
router.get('/', async (req, res) => {
  try {
    let theme = await Theme.findOne({ where: { isActive: true } });
    
    // If no theme exists, create a default one
    if (!theme) {
      theme = await Theme.create({});
    }
    
    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

// PUT update active theme
router.put('/', async (req, res) => {
  try {
    let theme = await Theme.findOne({ where: { isActive: true } });
    
    if (!theme) {
      theme = await Theme.create(req.body);
    } else {
      await theme.update(req.body);
    }
    
    res.json(theme);
  } catch (error) {
    res.status(400).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

export default router;
