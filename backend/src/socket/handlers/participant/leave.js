import Meeting from "../../../models/meeting.js";

const handleLeaveMeeting = async (io, socket, callback) => {
  const { meetingCode, participantId } = socket.data;

  if (!meetingCode || !participantId) {
    console.log("Socket isn't associated with a participant");
    callback({
      status: false,
      message: "Socket isn't associated with a participant"
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

  const participant = meeting.participants.id(participantId);
  if (!participant) {
    console.log("Participant Id Invalid");
    callback({
      status: false,
      message: "Participant Id Invalid"
    });
    return;
  }

  participant.status = "left";
  await meeting.save();

  socket.leave(`meeting:${meetingCode}`);
  socket.leave(`participant:${participantId}`);

  io
    .to(`meeting:${meetingCode}`)
    .except(`participant:${participantId}`)
    .emit("participant-left", {
      participantId,
      name: participant.name
    });

  callback({
    status: true,
  });
};

export { handleLeaveMeeting };
