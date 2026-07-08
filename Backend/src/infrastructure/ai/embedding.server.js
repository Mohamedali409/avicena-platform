import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

// هنا هحول النص

const embedText = async (text) => {
  const result = await model.embedContent(text);
  return result.embedding.values;
};

// تحويل كل ال vectors النصوص مره وحده
const embedBatch = async (texts) => {
  const results = await Promise.all(texts.map((t) => embedBatch(t)));
  return results;
};

export { embedText, embedBatch };
