const mongoose = require('mongoose');

const HomeworkQuestionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  homeworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homework',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HomeworkQuestion = mongoose.model('HomeworkQuestion', HomeworkQuestionSchema);

module.exports = HomeworkQuestion;