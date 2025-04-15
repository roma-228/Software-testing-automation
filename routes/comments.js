const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { postId, email, content } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const comment = new Comment({ postId, author: user._id, content });
    await comment.save();
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
