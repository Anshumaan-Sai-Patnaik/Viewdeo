const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true
  },
  messages: [
    {
      sender: {
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
      },
      timeStamp: {
        type: Date,
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('Conversation', conversationSchema);