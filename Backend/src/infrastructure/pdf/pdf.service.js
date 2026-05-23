import PDFDocument from "pdfkit";

export const generateReportPDF = (report) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc
      .fontSize(20)
      .text("التقرير الطبي - سلامتك", { align: "center" })
      .moveDown()
      .fontSize(12)
      .text(`المريض: ${report.userData?.name || ""}`)
      .text(`الطبيب: ${report.docData?.name || ""}`)
      .text(
        `التاريخ: ${new Date(report.createdAt || Date.now()).toLocaleDateString("ar-EG")}`,
      )
      .moveDown()
      .text(`الشكوى: ${report.complaint}`)
      .text(`الفحص: ${report.examination}`)
      .text(`التشخيص: ${report.diagnosis}`)
      .moveDown();

    if (report.treatment?.length) {
      doc.text("العلاج:");
      report.treatment.forEach((t) =>
        doc.text(
          `  - ${t.name}${t.dosage ? " | " + t.dosage : ""}${t.duration ? " | " + t.duration : ""}`,
        ),
      );
    }

    if (report.notes) doc.moveDown().text(`ملاحظات: ${report.notes}`);
    if (report.nextVisit)
      doc.text(
        `الزيارة القادمة: ${new Date(report.nextVisit).toLocaleDateString("ar-EG")}`,
      );

    doc.end();
  });
};
