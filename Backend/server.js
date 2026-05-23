import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./src/infrastructure/database/mongo.connection.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`🚀 Avicena server running on port ${PORT}`);
  });
};

startServer();
