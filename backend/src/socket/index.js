import { Server } from "socket.io";
import passport from "passport";

import { sessionMiddleware } from "../config/session.js";
import { wrap } from "./middleware/session.js";
import { handleConnection } from "./handlers/connection.js";

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

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.on("connection", handleConnection);

  return io;
};

export { setupSocket };
