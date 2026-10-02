import Meeting from "../../../models/meeting.js";

const handleRequestJoin = async (io, socket, { meetingCode, participantId }, callback) => {
  const meeting = await Meeting.findOne({ meetingCode });
  if (!meeting) {
    console.log("Meeting Code Invalid");
    callback(false);
    return;
  }
  if (!meeting.startedAt) {
    console.log("Meeting has not Started");
    callback(false);
    return;
  }
  if (meeting.endedAt) {
    console.log("Meeting has Ended");
    callback(false);
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

  console.log("Participant verified:", participant.name);

  socket.data.meetingCode = meetingCode;
  socket.data.participantId = participantId;
  socket.data.type = participant.type;
  socket.data.name = participant.name;

  socket.join(`participant:${participantId}`);

  io.to(`host:${meeting.createdBy.toString()}`).emit("set-in-wait", {
    meetingCode,
    participantId,
    type: participant.type,
    name: participant.name
  });

  callback(true);

};

export { handleRequestJoin };
