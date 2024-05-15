// models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true, unique: true },
  elo: { type: Number, default: 500 },
  type:{ type: String, default: 0 }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;