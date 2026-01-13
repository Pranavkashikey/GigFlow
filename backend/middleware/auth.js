const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Cookies received:', req.cookies); // Debug log
    
    const token = req.cookies.token;
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'No token, please login first' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded); // Debug log
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found in DB');
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('User found:', user.id, user.name); // Debug log
    req.user = user;
    req.user.id = user._id; // ← YE LINE ZAROORI!
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
