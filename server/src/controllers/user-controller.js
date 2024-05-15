const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
// const Question = require('../models/Question.js')
require('dotenv').config();

// Secret key for JWT. In production, use an environment variable to store this securely.
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const createUser = async (req, res) => {

	try {
		// Create a new user with the request body data
    const { username, email, password, role, createdAt, firstName, lastName, school, grade} = req.body;

    // search if there is existing email in the system
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const saltRounds = 10;

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newUser = new User({
      // ... other user fields,
      username: username,
      email: email,
      passwordHash: hashedPassword,
      role: role,
      createdAt: createdAt,
      firstName: firstName,
      lastName: lastName,
      school: school,
      grade: grade,
    });

		// Save the user to the database
		await newUser.save();
		// Send a response with the created user
		res.status(201).json({ message: `Successfully created user: ${username}`});
	} catch (error) {
		// Send an error response if something goes wrong
		res.status(400).json({ message: error.message });
	}
}

// const updateQuestion =  async (req, res) => {
//   const result = await Question.updateMany(
//     {},
//     { $set: { elo: 500}}
//   );
//   console.log(result);
//   return res.status(200).json({ message: result });
// }

const login =  async (req, res) => {
  try {
    const { formData } = req.body;

    console.log(formData);
    
    // Find user by email
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if the provided password matches the stored hash
    const isMatch = await bcrypt.compare(formData.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // User matched, create JWT payload
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // Sign token
    jwt.sign(payload, jwtSecretKey, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token: 'Bearer ' + token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createUser,
  login,
  // updateQuestion
};