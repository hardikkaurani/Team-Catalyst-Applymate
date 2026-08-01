const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'applymate_super_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

class AuthService {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      const error = new Error('Please provide name, email, and password');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User profile not found');
      error.statusCode = 404;
      throw error;
    }
    return user.toJSON();
  }

  async updateProfile(userId, { name, email }) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User profile not found');
      error.statusCode = 404;
      throw error;
    }

    if (name) user.name = name.trim();
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
      if (existing) {
        const error = new Error('Email is already taken by another user');
        error.statusCode = 400;
        throw error;
      }
      user.email = normalizedEmail;
    }

    await user.save();
    return user.toJSON();
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      const error = new Error('Please provide current password and new password');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }
}

module.exports = new AuthService();
