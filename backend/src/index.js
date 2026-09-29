import "dotenv/config";

import http from "http";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { setupSocket } from "./socket/index.js";
import { routes } from "./routes/index.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    setupSocket(server);
    
    server.listen(PORT, ()=> {
      console.log(`Listening to Port: ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server");
    process.exit(1);
  }
};

startServer();

app.get('/', (req, res)=> {
  res.send("Hi👋");
});

app.use('/', routes);
