const authService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error during registration',
      });
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: result,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error during login',
      });
    }
  }
}

module.exports = new AuthController();
