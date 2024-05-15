const express = require('express');
//const { createUser, login, updateQuestion } = require('../controllers/user-controller.js')
const { createUser, login } = require('../controllers/user-controller.js')

const router = express.Router();

router.post('/create-user', createUser);
router.post('/login', login);
// router.post('/update_question', updateQuestion);

module.exports = router