import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  meetingCode: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
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
}, {
  timestamps: true
});

export default mongoose.model('Meeting', meetingSchema);