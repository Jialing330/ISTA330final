const express = require('express');
const mongoose = require('mongoose');
const Character = require('../models/Character');
const Checklist = require('../models/Checklist');

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const characters = await Character.find({ userId: req.params.userId });
    res.status(200).json({ characters });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load characters', error: err.message });
  }
});

router.post('/add', async (req, res) => {
  const { userId, name } = req.body;
  try {
    const character = new Character({ userId: new mongoose.Types.ObjectId(userId), name });
    await character.save();

    const seasons = ['spring', 'summer', 'fall', 'winter', 'AllChecklist'];
    for (const season of seasons) {
      const checklist = new Checklist({
        userId: new mongoose.Types.ObjectId(userId),
        character: name,
        season,
        items: []
      });
      await checklist.save();
    }

    res.status(201).json({ message: 'Character created', character });
  } catch (err) {
    res.status(500).json({ message: 'Error creating character', error: err.message });
  }
});

router.delete('/delete/:userId/:name', async (req, res) => {
  try {
    await Character.deleteOne({ userId: req.params.userId, name: req.params.name });
    await Checklist.deleteMany({ userId: req.params.userId, character: req.params.name });
    res.status(200).json({ message: 'Character deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting character', error: err.message });
  }
});

module.exports = router;
