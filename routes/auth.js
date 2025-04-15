const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ email: req.body.email, username: req.body.username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const posts = await require('../models/Post').find({ author: user._id }).populate('author');
    res.status(200).json({ user, posts });
  } catch (error) {
    res.status(500).json({ error: 'Server error during profile retrieval' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { username, email, newPassword } = req.body;
  try {
    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(400).json({ error: 'No user found with this username and email' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
