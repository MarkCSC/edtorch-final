const express = require('express');
const { getProfile } = require('../controllers/profile-controller.js');
const {jwtMiddleware} = require('../middlewares/authentication.js');

const router = express.Router();

router.get('/get-profile', jwtMiddleware, getProfile);

module.exports = router