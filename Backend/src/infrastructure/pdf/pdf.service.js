import printer from "../../config/pdf.fonts.js";

export const generateReportPDF = async (report) => {
  return new Promise((resolve, reject) => {
    const treatments = report.treatment || [];

    const card = (title, body) => ({
      margin: [0, 10],
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                {
                  text: title,
                  style: "cardTitle",
                },
                {
                  text: body || "-",
                  style: "cardBody",
                },
              ],
            },
          ],
        ],
      },
      layout: {
        hLineColor: () => "#DCE3EA",
        vLineColor: () => "#DCE3EA",
        fillColor: () => "#FAFBFC",
      },
    });

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [30, 35, 30, 50],
      pageDirection: "rtl",

      defaultStyle: {
        font: "Cairo",
        alignment: "right",
        fontSize: 10,
      },

      footer(currentPage, pageCount) {
        return {
          margin: [30, 10],
          columns: [
            {
              text: `تم إنشاء التقرير بتاريخ ${new Date(
                report.createdAt,
              ).toLocaleDateString("ar-EG")}`,
              color: "#777",
              fontSize: 8,
            },
            {
              text: `صفحة ${currentPage} / ${pageCount}`,
              alignment: "left",
              color: "#777",
              fontSize: 8,
            },
          ],
        };
      },

      content: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  stack: [
                    {
                      text: "AVICENA MEDICAL CENTER",
                      alignment: "center",
                      color: "#1565C0",
                      bold: true,
                      fontSize: 20,
                    },
                    {
                      text: "التقرير الطبي",
                      alignment: "center",
                      margin: [0, 5],
                      fontSize: 14,
                      bold: true,
                    },
                  ],
                },
              ],
            ],
          },

          layout: {
            fillColor: () => "#F4F8FC",
            hLineColor: () => "#D5E4F3",
            vLineColor: () => "#D5E4F3",
          },
        },

        {
          margin: [0, 18],

          table: {
            widths: ["50%", "50%"],

            body: [
              [
                {
                  stack: [
                    {
                      text: "بيانات المريض",
                      style: "boxTitle",
                    },
                    {
                      text: `الاسم : ${report.userData?.name || "-"}`,
                    },
                    {
                      text: `رقم التقرير : ${
                        report._id?.toString().slice(-8) || "-"
                      }`,
                    },
                  ],
                },

                {
                  stack: [
                    {
                      text: "بيانات الطبيب",
                      style: "boxTitle",
                    },
                    {
                      text: `الاسم : ${report.docData?.name || "-"}`,
                    },
                    {
                      text: `التاريخ : ${new Date(
                        report.createdAt,
                      ).toLocaleDateString("ar-EG")}`,
                    },
                  ],
                },
              ],
            ],
          },

          layout: {
            fillColor: () => "#FAFAFA",
            hLineColor: () => "#D9D9D9",
            vLineColor: () => "#D9D9D9",
          },
        },

        card("الشكوى", report.complaint),

        card("الفحص السريري", report.examination),

        card("التشخيص", report.diagnosis),

        {
          margin: [0, 10],

          table: {
            headerRows: 1,

            widths: ["45%", "25%", "30%"],

            body: [
              [
                {
                  text: "الدواء",
                  style: "tableHeader",
                },
                {
                  text: "الجرعة",
                  style: "tableHeader",
                },
                {
                  text: "المدة",
                  style: "tableHeader",
                },
              ],

              ...treatments.map((t) => [
                t.name || "-",
                t.dosage || "-",
                t.duration || "-",
              ]),
            ],
          },

          layout: {
            fillColor: (row) => (row === 0 ? "#1976D2" : null),

            hLineColor: () => "#DDD",

            vLineColor: () => "#DDD",
          },
        },

        card("ملاحظات الطبيب", report.notes),

        report.nextVisit
          ? {
              margin: [0, 15],
              text: `موعد الزيارة القادمة : ${new Date(
                report.nextVisit,
              ).toLocaleDateString("ar-EG")}`,
              bold: true,
              color: "#1565C0",
            }
          : {},

        {
          margin: [0, 45, 0, 0],
          alignment: "right",

          stack: [
            {
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 170,
                  y2: 0,
                  lineWidth: 1,
                },
              ],
            },

            {
              text: "توقيع الطبيب",
              bold: true,
              margin: [0, 8, 0, 0],
            },

            {
              text: report.docData?.name || "",
            },
          ],
        },
      ],

      styles: {
        boxTitle: {
          bold: true,
          fontSize: 11,
          color: "#1565C0",
          margin: [0, 0, 0, 6],
        },

        cardTitle: {
          bold: true,
          fontSize: 11,
          color: "#1565C0",
          margin: [0, 0, 0, 6],
        },

        cardBody: {
          fontSize: 10,
          lineHeight: 1.5,
        },

        tableHeader: {
          bold: true,
          color: "#FFF",
          alignment: "center",
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const chunks = [];

    pdfDoc.on("data", (chunk) => chunks.push(chunk));

    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));

    pdfDoc.on("error", reject);

    pdfDoc.end();
  });
};
