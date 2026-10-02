import Meeting from "../../../models/meeting.js";

const handleStartMeeting = async (socket, { meetingCode }) => {
  if (!socket.request.user) {
    console.log("Unauthenticated user cannot Start a Meeting");
    return;
  }

  const meeting = await Meeting.findOne({ meetingCode });
  if (!meeting) {
    console.log("Meeting Code Invalid");
    return;
  }

  if (socket.request.user._id.toString() !== meeting.createdBy.toString()) {
    console.log("You are not the Host of this Meeting");
    return;
  }

  socket.join(`host:${socket.request.user._id.toString()}`);
  socket.join(`meeting:${meetingCode}`);

  console.log("Meeting has started");
  console.log("Host has joined the meeting room:", meetingCode);
};

export { handleStartMeeting };
