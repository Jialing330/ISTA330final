const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Wrong email or password' });
    res.status(200).json({ message: 'Login successful', user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

module.exports = router;
