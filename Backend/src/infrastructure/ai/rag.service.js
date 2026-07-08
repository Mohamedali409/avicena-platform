import { v4 as uuidv4 } from "uuid";
import qdrantClient, { COLLECTION_NAME } from "./qdrant.client.js";
import { embedText } from "./embedding.server.js";

const chunkReport = (report) => {
  const data = new Date(report.createdAt).toLocaleDateString("ar-EG");
  const chunks = [];
  // chuck 1: الخاصه بالشكوه الخاصه بالمريض و الفحص

  chunks.push({
    text: `Medical Report
    Date: ${date}
    Patient: ${report.userData?.name || ""}

    Chief Complaint:
    ${report.complaint}

    Physical Examination:
    ${report.examination}`,
    section: "complaint_examination",
  });
  // Chunk 2: التشخيص

  chunks.push({
    text: `Medical Diagnosis
      Date: ${date}
      
      Diagnosis:
      ${report.diagnosis}`,
    section: "diagnosis",
  });

  // Chunk 3: Treatment
  if (report.treatment?.length) {
    const treatmentText = report.treatment
      .map(
        (t) =>
          `${t.name}${t.dosage ? " | Dosage: " + t.dosage : ""}${
            t.duration ? " | Duration: " + t.duration : ""
          }`,
      )
      .join("\n");

    chunks.push({
      text: `Treatment Plan
                    Date: ${date}
                    
                    Prescribed Medications:
                    ${treatmentText}`,
      section: "treatment",
    });
  }
  // Chunk 4: Clinical Notes
  if (report.notes) {
    chunks.push({
      text: `Clinical notes recorded on ${date}: ${report.notes}`,
      section: "notes",
    });
  }

  return chunks;
};

// * إضافة تقرير واحد لـ Qdrant

export const indexReport = async (report) => {
  const chucks = chunkReport(report);

  const points = await Promise.all(
    chucks.map(async (chuck) => {
      const vector = await embedText(chuck.text);
      return {
        id: uuidv4(),
        vector,
        payload: {
          userId: report.userId.toString(),
          docId: report.docId.toString(),
          reportId: report._id.toString(),
          section: report.section,
          text: report.text,
          date: report.createdAt,
        },
      };
    }),
  );

  await qdrantClient.upsert(COLLECTION_NAME, { points });
  return points.length;
};

// * إضافة كل تقارير مريض معين (عند أول فتح للمحادثة)
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
    vector,
    limit,
    filter: {
      must: [{ key: "userId", match: { value: userId } }],
    },
    with_payload: true,
  });

  return result.map((r) => ({
    text: r.payload.text,
    section: r.payload.section,
    date: r.payload.date,
    score: r.score,
  }));
};

export const deleteUSerVectors = async (userId) => {
  await qdrantClient.delete(COLLECTION_NAME, {
    filter: {
      must: [{ key: "userId", match: { value: userId } }],
    },
  });
};
