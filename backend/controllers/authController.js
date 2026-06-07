const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'focushub_super_secret_key_12345', {
    expiresIn: '30d'
  });
};

// Initialize in-memory store
global.mockUsers = global.mockUsers || [];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const userExists = global.mockUsers.find(u => u.email === email);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockId = new mongoose.Types.ObjectId().toString();
      const mockUser = {
        _id: mockId,
        name,
        email,
        password: hashedPassword,
        streak: 0,
        completedTasksCount: 0,
        badges: [],
        avatar: `gradient-${Math.floor(Math.random() * 5) + 1}`,
        createdAt: new Date().toISOString()
      };

      global.mockUsers.push(mockUser);

      return res.status(201).json({
        success: true,
        data: {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          streak: mockUser.streak,
          completedTasksCount: mockUser.completedTasksCount,
          badges: mockUser.badges,
          avatar: mockUser.avatar,
          createdAt: mockUser.createdAt,
          token: generateToken(mockUser._id)
        }
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: `gradient-${Math.floor(Math.random() * 5) + 1}`
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          completedTasksCount: user.completedTasksCount,
          badges: user.badges,
          avatar: user.avatar,
          createdAt: user.createdAt,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const user = global.mockUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          completedTasksCount: user.completedTasksCount,
          badges: user.badges,
          avatar: user.avatar,
          createdAt: user.createdAt,
          token: generateToken(user._id)
        }
      });
    }

    // Check for user email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        completedTasksCount: user.completedTasksCount,
        badges: user.badges,
        avatar: user.avatar,
        createdAt: user.createdAt,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const user = global.mockUsers.find(u => u._id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          lastCompletedDate: user.lastCompletedDate,
          completedTasksCount: user.completedTasksCount,
          badges: user.badges,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        lastCompletedDate: user.lastCompletedDate,
        completedTasksCount: user.completedTasksCount,
        badges: user.badges,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile (e.g. avatar, name)
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const user = global.mockUsers.find(u => u._id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (avatar) user.avatar = avatar;

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          completedTasksCount: user.completedTasksCount,
          badges: user.badges,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        streak: updatedUser.streak,
        completedTasksCount: updatedUser.completedTasksCount,
        badges: updatedUser.badges,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
