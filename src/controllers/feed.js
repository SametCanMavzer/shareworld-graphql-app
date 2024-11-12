const catchAsync = require('../utils/catchAsync');
const { clearImage } = require('../utils/fileHelper');
const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = catchAsync(async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  const totalItems = await Post.find().countDocuments();
  const posts = await Post.find().populate('creator')
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  res.status(200).json({
    message: 'Fetched posts successfully.',
    posts: posts,
    totalItems: totalItems
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: req.file.path,
    creator: req.userId
  });

  await post.save();
  res.status(201).json({
    message: 'Post created successfully!',
    post: post
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Could not find post.');
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ message: 'Post fetched.', post: post });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Could not find post.');
    error.statusCode = 404;
    throw error;
  }
  if (post.creator.toString() !== req.userId.toString()) {
    const error = new Error('Not authorized!');
    error.statusCode = 403;
    throw error;
  }
  if (imageUrl !== post.imageUrl) {
    clearImage(post.imageUrl);
  }
  post.title = title;
  post.imageUrl = imageUrl;
  post.content = content;
  const result = await post.save();
  res.status(200).json({ message: 'Post updated!', post: result });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error('Could not find post.');
    error.statusCode = 404;
    throw error;
  }
  if (post.creator.toString() !== req.userId.toString()) {
    const error = new Error('Not authorized!');
    error.statusCode = 403;
    throw error;
  }
  clearImage(post.imageUrl);
  await Post.findByIdAndRemove(postId);

  const user = await User.findById(req.userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  user.posts.pull(postId);
  await user.save();

  res.status(200).json({ message: 'Deleted post.' });
});