import express from 'express';
import Setting from '../models/Setting.js';
import { validatePortfolio } from '../validatePortfolio.js';
import { createHash } from 'node:crypto';
import sequelize from '../db.js';
import { Transaction } from 'sequelize';

const router = express.Router();
const revisionOf = value => '"' + createHash('sha256').update(JSON.stringify(value)).digest('hex') + '"';

router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findByPk(req.params.key);
    if (!setting) return res.status(404).json({ message: 'Not found' });
    if (req.params.key === 'portfolio') res.set({ ETag: revisionOf(setting.value), 'Cache-Control': 'no-store' });
    res.json(setting.value);
  } catch (error) {
    res.status(500).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

router.put('/:key', async (req, res) => {
  if (req.params.key === 'portfolio' && !validatePortfolio(req.body)) {
    return res.status(400).json({ message: 'Invalid portfolio configuration' });
  }
  try {
    if (req.params.key === 'portfolio') {
      if (!req.get('If-Match') && req.get('If-None-Match') !== '*') return res.status(428).json({ message: 'Reload the editor before publishing so changes from other admins are preserved.' });
      const outcome = await sequelize.transaction({ type: Transaction.TYPES.IMMEDIATE }, async transaction => {
        const setting = await Setting.findByPk('portfolio', { transaction });
        if (setting ? req.get('If-Match') !== revisionOf(setting.value) : req.get('If-None-Match') !== '*') return false;
        if (setting) await setting.update({ value: req.body }, { transaction });
        else await Setting.create({ key: 'portfolio', value: req.body }, { transaction });
        return true;
      });
      if (!outcome) return res.status(412).json({ message: 'Another admin published a newer version. Your draft is kept. Load the latest published version and review it before publishing.' });
      res.set({ ETag: revisionOf(req.body), 'Cache-Control': 'no-store' });
      return res.json(req.body);
    }
    const [setting, created] = await Setting.findOrCreate({
      where: { key: req.params.key },
      defaults: { value: req.body }
    });
    
    if (!created) {
      setting.value = req.body;
      await setting.save();
    }
    
    res.json(setting.value);
  } catch (error) {
    res.status(400).json({ message: 'Could not complete this request. Check your input and try again.' });
  }
});

export default router;
