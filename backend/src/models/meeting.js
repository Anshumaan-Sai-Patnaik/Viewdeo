const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  participants: [
    {
      type: {
        type: String,
        enum: ['user', 'guest'],
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      guestId: {
        type: String
      },
      name: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('Meeting', meetingSchema);