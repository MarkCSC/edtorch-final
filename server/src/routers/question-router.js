const express = require('express');
const {getExercise, checkExercise } = require('../controllers/exercise-controller.js');
const {jwtMiddleware} = require('../middlewares/authentication.js');

const router = express.Router();

router.post('/get-exercise', jwtMiddleware, getExercise);
router.post('/check-exercise', jwtMiddleware, checkExercise);

module.exports = router