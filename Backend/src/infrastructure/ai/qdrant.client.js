import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
});

export const COLLECTION_NAME = "medical_reports";
export const VECTOR_SIZE = 768;

export const initQdrant = async () => {
  try {
    const collections = await client.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME,
    );

    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });
      console.log(`Qdrant collection "${COLLECTION_NAME}" created`);
    } else {
      console.log(`Qdrant collection "${COLLECTION_NAME}" ready`);
    }
  } catch (error) {
    console.log("Qdrant init error :", error.message);
  }
};

export default client;
