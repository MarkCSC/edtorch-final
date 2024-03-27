const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js')

const router = express.Router();

const saltRounds = 10;

router.post('/create-user', async (req, res) => {

	try {
		// Create a new user with the request body data
    const { username, email, password, role, createdAt, firstName, lastName, school, grade} = req.body;

    // search if there is existing email in the system
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

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
});

module.exports = router