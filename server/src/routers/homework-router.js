const express = require('express');

const {createHomework, publish, getHomeworkByCode, submitHomeworkByCode} = require('../controllers/homework-controller.js');

const {jwtMiddleware} = require('../middlewares/authentication.js');

const router = express.Router();

router.get('/get-homework/:code', jwtMiddleware, getHomeworkByCode);
router.post('/submit-answers/:code', jwtMiddleware, submitHomeworkByCode);
router.post('/create-homework-question', jwtMiddleware, createHomework);
router.post('/publish', jwtMiddleware, publish);

module.exports = router