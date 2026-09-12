const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  username: {
    type: String,
    required: true
  },
  emailID: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);