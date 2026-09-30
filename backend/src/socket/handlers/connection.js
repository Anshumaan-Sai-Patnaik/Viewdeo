import Meeting from "../../models/meeting.js";

const handleConnection = (socket) => {
  console.log("A client connected");
  console.log(socket.id);

  console.log("User:", socket.request.user);

  socket.on("request-to-join", async ({ meetingCode, participantId }) => {
      const meeting = await Meeting.findOne({ meetingCode });
      if (!meeting) {
        console.log("Meeting not found");
        return;
      }

      const participant = meeting.participants.id(participantId);
      if (!participant) {
        console.log("Participant not found");
        return;
      }
      if (participant.status !== "waiting") {
        console.log("Participant is not waiting");
        return;
      }
      console.log("Participant verified:", participant.name);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
};

export { handleConnection };
