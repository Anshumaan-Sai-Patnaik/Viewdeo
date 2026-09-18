import Meeting from "../models/meeting.js";
import { generateMeetingCode } from "../utils/meetingCode.js";

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
    return res.status(400).json({
      success: false,
      message: err.message || "An error occurred while creating meeting."
    });
  }
};