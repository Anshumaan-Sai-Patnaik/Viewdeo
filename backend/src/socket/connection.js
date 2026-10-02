import { handleStartMeeting } from "./handlers/meeting/start.js";
import { handleRequestJoin } from "./handlers/participant/join.js";
import { handleAcceptParticipant } from "./handlers/participant/accept.js";
import { handleDisconnect } from "./handlers/connection/disconnect.js";

const onConnection = (io, socket) => {
  // here, socket is the server-side socket representing that client's connection.

  console.log("A client connected");
  console.log(socket.id);

  socket.on("start-the-meeting", (data) => {
    handleStartMeeting(socket, data);
  });

  socket.on("request-to-join", (data, callback) => {
    handleRequestJoin(io, socket, data, callback);
  });

  socket.on("accept-a-participant", (data) => {
    handleAcceptParticipant(io, socket, data);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket);
  });
};

export { onConnection };
