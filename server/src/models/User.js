// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, default: 'student' },
  createdAt: { type: Date, default: Date.now },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  school: { type: String, required: true },
  grade: { type: Number, required: true },

  abilityScores: {
    type: [Number],
    required: function() { return this.role === 'student'; }, // Required only for students
    validate: {
      validator: function(v) {
        return v.length === 8; // Ensures the array has exactly 8 numbers
      },
      message: props => `Expected exactly 8 ability scores, but got ${props.value.length}`
    },
    default: [0, 0, 0, 0, 0, 0, 0, 0] // Default values
  },

});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;