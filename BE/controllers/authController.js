const User = require('../models/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: '400',
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({
      status: '201',
      message: 'Registered successfully',
      data: {
        user: savedUser.toJSON()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: '500',
      message: 'Server error'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: '404',
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: '400',
        message: 'Invalid credentials'
      });
    }
    
    const payload = {
      _id: user._id.toString(),
      username: user.username
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15d' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      status: '200',
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        access_token: accessToken,
        refresh_token: refreshToken
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: '500',
      message: 'Server error'
    });
  }
};

exports.refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      status: '400',
      message: 'Missing refresh token'
    });
  }

  try {
    const decoded = jwt.verify(refresh_token, JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: '401',
        message: 'User not found'
      });
    }

    const payload = {
      _id: user._id.toString(),
      username: user.username
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      status: '200',
      message: 'Token refreshed successfully',
      data: {
        access_token: newAccessToken,
        refresh_token: refreshToken
      }
    });
  } catch (err) {
    return res.status(401).json({
      status: '401',
      message: 'Invalid or expired refresh token'
    });
  }
};
