import { Server } from "socket.io";
import passport from "passport";

import { sessionMiddleware } from "../config/session.js";
import { wrap } from "./middleware/session.js";
import { onConnection } from "./connection.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.VITE_PUBLIC_URL|| "http://localhost:5173",
        process.env.VITE_PROTECTED_URL|| "http://localhost:5174"
      ],
      credentials: true
    }
  });

  // Think of io as the Socket.IO server manager. It is not one particular socket.

  //           Node HTTP Server
  //                │
  //    ┌───────────┴───────────┐
  //    │                       │
  // Express                 Socket.IO
  //    │                       │
  // HTTP APIs                 io
  //                            │
  //                ┌───────────┼───────────┐
  //                │           │           │
  //             socket 1    socket 2    socket 3


  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  // Whenever a new client socket successfully connects to this Socket.IO server, run onConnection.
  io.on("connection", (socket) => {
    onConnection(io, socket);
  });

  return io;
};

export { setupSocket };
