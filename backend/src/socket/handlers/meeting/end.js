import Meeting from "../../../models/meeting.js";

const handleEndMeeting = async (io, socket, { meetingCode }, callback) => {
  if (!socket.request.user) {
    console.log("Unauthenticated user cannot End a Meeting");
    callback({
      status: false,
      message: "Unauthenticated user cannot End a Meeting"
    });
    return;
  }

  const meeting = await Meeting.findOne({ meetingCode });
  if (!meeting) {
    console.log("Meeting Code Invalid");
    callback({
      status: false,
      message: "Meeting Code Invalid"
    });
    return;
  }

  if (socket.request.user._id.toString() !== meeting.createdBy.toString()) {
    console.log("You are not the Host of this Meeting");
    callback({
      status: false,
      message: "You are not the Host of this Meeting"
    });
    return;
  }

  socket.leave(`meeting:${meetingCode}`);
  socket.leave(`host:${socket.request.user._id.toString()}`);

  io
    .to(`meeting:${meetingCode}`)
    .emit("meeting-ended");

  // Fetch all connected sockets in this meeting
  const socketsInMeeting = await io.in(`meeting:${meetingCode}`).fetchSockets();
  // Remove each socket from BOTH rooms on the server side
  for (const s of socketsInMeeting) {
    s.leave(`meeting:${meetingCode}`);
    s.leave(`participant:${s.data.participantId}`);
  }

  callback({
    status: true,
    message: "Meeting has Ended"
  });
};

export { handleEndMeeting };
