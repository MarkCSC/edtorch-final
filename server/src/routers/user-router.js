const express = require('express');
const { createUser, login } = require('../controllers/user-controller.js')

const router = express.Router();

router.post('/create-user', createUser);
router.post('/login', login);

module.exports = router