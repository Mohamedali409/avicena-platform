import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./src/infrastructure/database/mongo.connection.js";
import client, {
  connectRedis,
} from "./src/infrastructure/redis/redis.client.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const startServer = async () => {
  await connectRedis();
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Avicena server running on port ${PORT}`);
  });
};

startServer();
