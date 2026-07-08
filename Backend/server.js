import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./src/infrastructure/database/mongo.connection.js";
import client, {
  connectRedis,
} from "./src/infrastructure/redis/redis.client.js";
import { initSocket } from "./src/infrastructure/socket/socket.server.js";
import { startEmailWorker } from "./src/infrastructure/queue/email.queue.js";
import { initQdrant } from "./src/infrastructure/ai/qdrant.client.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
  await connectRedis();
  await connectDB();

  startEmailWorker();
  await initQdrant();

  server.listen(PORT, () => {
    console.log(`Avicena server running on port ${PORT}`);
  });
};

startServer();
