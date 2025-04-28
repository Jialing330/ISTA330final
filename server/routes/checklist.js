const express = require('express');
const mongoose = require('mongoose');
const Checklist = require('../models/Checklist');

const router = express.Router();
router.post('/save', async (req, res) => {
  const { userId, characterName, season, items } = req.body;
  try {
    let checklist = await Checklist.findOne({ userId, characterName, season });
    if (checklist) {
      checklist.items = items;
      await checklist.save();
    } else {
      checklist = new Checklist({ userId, characterName, season, items });
      await checklist.save();
    }
    res.status(200).json({ message: 'Checklist saved successfully' });
  } catch (err) {
    console.error('❌ Error saving checklist:', err);
    res.status(500).json({ message: 'Error saving checklist', error: err.message });
  }
});

router.get('/load', async (req, res) => {
  const { userId, characterName, season } = req.query;
  try {
    const checklist = await Checklist.findOne({ userId, characterName, season });
    if (!checklist) {
      return res.status(200).json({ items: [] }); 
    }
    res.status(200).json({ items: checklist.items });
  } catch (err) {
    console.error('❌ Error loading checklist:', err);
    res.status(500).json({ message: 'Error loading checklist', error: err.message });
  }
});

module.exports = router;
