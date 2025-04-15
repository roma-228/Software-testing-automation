const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { title, content, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const newPost = new Post({ title, content, author: user._id });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating post' });
  }
});

router.put('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:postId', async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.postId);
    if (!result) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comments = await require('../models/Comment').find({ postId: post._id }).populate('author', 'username');
    res.status(200).json({ post, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
