import Meeting from "../models/meeting.js";
import { generateMeetingCode, generateGuestId } from "../utils/CodeAndIdGenerator.js";

export const createMeeting = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false
    });
  }

  try {
    const meetingCode = generateMeetingCode();
    const newMeeting = new Meeting({
      meetingCode,
      createdBy: req.user._id
    });
    await newMeeting.save();

    return res.status(201).json({
      success: true,
      meeting: newMeeting
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "An error occurred while creating meeting."
    });
  }
};

export const joinMeeting = async (req, res) => {
  const {meetingCode, name} = req.body;
  const isAuthenticated = req.isAuthenticated();

  const meeting = await Meeting.findOne({ meetingCode: meetingCode });
  
  if(!meeting) {
    return res.status(404).json({
      success: false,
      message: "Meeting Code Invalid"
    })
  }

  try {
    if(meeting.endedAt) {
      return res.status(410).json({
        success: false,
        message: "Meeting has Ended"
      })
    }

    const meetingStatus = meeting.startedAt ? "active" : "waiting";
    const newParticipant = {
      type: isAuthenticated ? 'user' : 'guest',
      userId: isAuthenticated ? req.user._id : undefined,
      guestId: !isAuthenticated ? generateGuestId() : undefined,
      name: name
    }
    await Meeting.updateOne({ meetingCode: meetingCode }, {
      $push: {
        participants: newParticipant
      }
    });
    return res.status(201).json({
      success: true,
      status: meetingStatus,
      participant: newParticipant
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "An error occurred while joining meeting."
    });
  }
}

export const startMeeting = async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({
    success: false,
    message: "Unauthorized request"
  });

  const {meetingCode} = req.body;

  const meeting = await Meeting.findOne({ meetingCode: meetingCode });
  
  if(!meeting) {
    return res.status(404).json({
      success: false,
      message: "Meeting Code Invalid"
    })
  }

  if(meeting.endedAt) {
    return res.status(410).json({
      success: false,
      message: "Meeting has Ended"
    })
  }

  if(!meeting.createdBy.equals(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "You are not the host of this meeting"
    })
  }

  try {
    await Meeting.updateOne({ meetingCode: meetingCode }, {
      startedAt: new Date()
    });
    return res.status(201).json({
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "An error occurred while joining meeting."
    });
  }
}

export const endMeeting = async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({
    success: false,
    message: "Unauthorized request"
  });

  const {meetingCode} = req.body;

  const meeting = await Meeting.findOne({ meetingCode: meetingCode });
  
  if(!meeting) {
    return res.status(404).json({
      success: false,
      message: "Meeting Code Invalid"
    })
  }

  if (meeting.endedAt) {
    return res.status(410).json({
      success: false,
      message: "Meeting has already Ended"
    });
  }

  if(!meeting.startedAt) {
    return res.status(410).json({
      success: false,
      message: "Meeting has not Started"
    })
  }

  if(!meeting.createdBy.equals(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "You are not the host of this meeting"
    })
  }

  try {
    await Meeting.updateOne({ meetingCode: meetingCode }, {
      endedAt: new Date()
    });
    return res.status(201).json({
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "An error occurred while joining meeting."
    });
  }
}
