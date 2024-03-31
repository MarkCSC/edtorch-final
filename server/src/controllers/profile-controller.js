const User = require('../models/User.js'); // Import the User model
require('dotenv').config();

const getProfile = async (req, res) => {
  try {
    // Assume the user ID is stored in req.user after being authenticated and verified
    const userId = req.auth.id;

    console.log(userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID is required.' });
    }

    // Find the user in the database excluding the passwordHash
    const user = await User.findById(userId, '-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send the user data excluding the passwordHash
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getProfile
};