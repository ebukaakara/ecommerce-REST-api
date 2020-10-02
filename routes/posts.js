const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Get all the posts
router.get('/', async (req, res) => {
   try {
      const allPosts = await Post.find();
      res.json(allPosts);
   } catch (err) {
      res.json({ message: err });
   }
});

// Get one post
router.get('/:postId', async (req, res) => {
   try {
      const onePost = await Post.findById(
         req.params.postId
      );
      res.json(onePost);
   } catch (err) {
      res.json({ message: err });
   }
});

// Delete one post
router.delete('/:postId', async (req, res) => {
   try {
      const deletePost = await Post.findOneAndDelete({
         _id: req.params._id,
      });
      res.json(deletePost);
   } catch (err) {
      res.json({ message: err });
   }
});

// Update one post
router.patch('/:postId', async (req, res) => {
   try {
      const updatePost = await Post.findOneAndUpdate(
         { _id: req.params._id },
         { $set: { title: req.params.title } }
      );
      res.json(updatePost);
   } catch (err) {
      res.json({ message: err });
   }
});

// Create a post
router.post('/', async (req, res) => {
   const post = new Post({
      title: req.body.title,
      description: req.body.description,
   });

   try {
      const savedPost = await post.save();
      res.json(savedPost);
   } catch (err) {
      res.json({ message: err });
   }
});

module.exports = router;
