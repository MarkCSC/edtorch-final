const express = require('express');

const {createHomework, publish} = require('../controllers/homework-controller.js');

const {jwtMiddleware} = require('../middlewares/authentication.js');

const router = express.Router();

router.post('/create-homework-question', jwtMiddleware, createHomework);
router.post('/publish', jwtMiddleware, publish);

module.exports = router