const express = require('express');
const {getExercise, checkExercise } = require('../controllers/exercise-controller.js');

const router = express.Router();

router.post('/get-exercise', getExercise);
router.post('/check-exercise', checkExercise);

module.exports = router