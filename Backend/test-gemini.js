// import "dotenv/config";
// import { GoogleGenAI } from "@google/genai";

// console.log("API Key:", process.env.GEMINI_API_KEY);

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const response = await ai.models.generateContent({
//   model: "gemini-2.5-flash-lite",
//   contents: "Hello",
// });

// console.log(response.text);

// import "dotenv/config";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const pager = await ai.models.list();

// for await (const model of pager) {
//   console.log(model.name);
// }

// import "dotenv/config";
// import { embedText } from "./src/infrastructure/ai/embedding.server.js";

// try {
//   const vector = await embedText("Hello World");

//   console.log("Vector Length:", vector.length);
//   console.log("First 5 values:", vector.slice(0, 5));
// } catch (err) {
//   console.error(err);
// }

import "dotenv/config";
import qdrantClient, {
  COLLECTION_NAME,
} from "./src/infrastructure/ai/qdrant.client.js";

try {
  await qdrantClient.deleteCollection(COLLECTION_NAME);
  console.log("Collection deleted successfully.");
} catch (err) {
  console.error(err);
}
