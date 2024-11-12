const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

exports.signup = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;

  const hashedPw = await bcrypt.hash(password, 12);

  const user = new User({
    email: email,
    password: hashedPw,
    name: name
  });
  const result = await user.save();

  res.status(201).json({ message: 'User created!', userId: result._id });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error('A user with this email could not be found.');
    error.statusCode = 401;
    throw error;
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = new Error('Wrong password!');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString()
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.status(200).json({ token: token, userId: user._id.toString() });
});

exports.getUserStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: user.status });
});


exports.updateUserStatus = catchAsync(async (req, res, next) => {
  const newStatus = req.body.status;
  const user = await User.findById(req.userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  user.status = newStatus;
  await user.save();
  res.status(200).json({ message: 'User updated.' });
});