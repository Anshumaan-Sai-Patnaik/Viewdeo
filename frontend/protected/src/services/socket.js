import { io } from "socket.io-client";

const socketAPI = io(
  import.meta.env.VITE_API_URL || "http://localhost:3000",
  {
    withCredentials: true
  }
);

export default socketAPI;
