import "dotenv/config";

import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import {routes} from "./routes"

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, ()=> {
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
