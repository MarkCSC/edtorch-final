const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HomeworkQuestion'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
});

const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = Homework;