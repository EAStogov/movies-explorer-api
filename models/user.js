const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  }
})

module.exports = mongoose.model('user', userSchema);