import PdfPrinter from "pdfmake/src/printer.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fonts = {
  Cairo: {
    normal: path.join(__dirname, "../fonts/Cairo-Regular.ttf"),
    bold: path.join(__dirname, "../fonts/Cairo-Bold.ttf"),
    italics: path.join(__dirname, "../fonts/Cairo-Regular.ttf"),
    bolditalics: path.join(__dirname, "../fonts/Cairo-Bold.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

export default printer;
