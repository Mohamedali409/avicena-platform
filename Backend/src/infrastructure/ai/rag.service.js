import { v4 as uuidv4 } from "uuid";
import qdrantClient, { COLLECTION_NAME } from "./qdrant.client.js";
import { embedText } from "./embedding.server.js";

const chunkReport = (report) => {
  const date = new Date(report.createdAt).toLocaleDateString("ar-EG");

  const chunks = [];

  chunks.push({
    text: `
Medical Report
Date: ${date}

Chief Complaint:
${report.complaint}

Physical Examination:
${report.examination}
`,
    section: "complaint_examination",
  });

  chunks.push({
    text: `
Diagnosis
Date: ${date}

${report.diagnosis}
`,
    section: "diagnosis",
  });

  if (report.treatment?.length) {
    chunks.push({
      text: `
Treatment
Date: ${date}

${report.treatment
  .map(
    (t) =>
      `${t.name}
Dosage: ${t.dosage || ""}
Duration: ${t.duration || ""}`,
  )
  .join("\n")}
`,
      section: "treatment",
    });
  }

  if (report.notes) {
    chunks.push({
      text: `
Clinical Notes
Date: ${date}

${report.notes}
`,
      section: "notes",
    });
  }

  return chunks;
};

export const indexReport = async (report) => {
  const chunks = chunkReport(report);

  const points = await Promise.all(
    chunks.map(async (chunk) => {
      const vector = await embedText(chunk.text);

      return {
        id: uuidv4(),
        vector,
        payload: {
          userId: report.userId.toString(),
          docId: report.docId.toString(),
          reportId: report._id.toString(),

          section: chunk.section,
          text: chunk.text,
          date: report.createdAt,
        },
      };
    }),
  );

  await qdrantClient.upsert(COLLECTION_NAME, {
    wait: true,
    points,
  });

  return points.length;
};

export const indexAllReportsForUser = async (reports) => {
  let total = 0;

  for (const report of reports) {
    total += await indexReport(report);
  }

  return total;
};

export const searchReports = async (query, userId, limit = 5) => {
  const queryVector = await embedText(query);

  const result = await qdrantClient.search(COLLECTION_NAME, {
    vector: queryVector,
    limit,
    with_payload: true,
    filter: {
      must: [
        {
          key: "userId",
          match: {
            value: userId.toString(),
          },
        },
      ],
    },
  });

  return result.map((item) => ({
    text: item.payload.text,
    section: item.payload.section,
    date: item.payload.date,
    score: item.score,
  }));
};

export const deleteUserVectors = async (userId) => {
  await qdrantClient.delete(COLLECTION_NAME, {
    filter: {
      must: [
        {
          key: "userId",
          match: {
            value: userId.toString(),
          },
        },
      ],
    },
  });
};
