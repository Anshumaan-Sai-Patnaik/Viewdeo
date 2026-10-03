import Meeting from "../../../models/meeting.js";

const handleRejectParticipant = async (io, socket, { meetingCode, participantId }) => {
  if (!socket.request.user) {
    console.log("Unauthorized request");
    return;
  }

  const meeting = await Meeting.findOne({ meetingCode });
  if (!meeting) {
    console.log("Meeting Code Invalid");
    return;
  }
  if (!meeting.startedAt) {
    console.log("Meeting has not Started");
    return;
  }
  if (meeting.endedAt) {
    console.log("Meeting has Ended");
    return;
  }

  if (
    socket.request.user._id.toString() !== meeting.createdBy.toString()) {
    console.log("You are not the Host of this Meeting");
    return;
  }

  const participant = meeting.participants.id(participantId);
  if (!participant) {
    console.log("Participant Id Invalid");
    return;
  }
  if (participant.status !== "waiting") {
    console.log("Participant isn't Waiting");
    return;
  }

  participant.status = "rejected";
  await meeting.save();

  io.to(`participant:${participantId}`).emit("participant-rejected", {
    meetingCode,
    participantId
  });
};

export { handleRejectParticipant };
