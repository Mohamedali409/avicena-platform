import * as XLSX from "xlsx";

// Maps many possible header spellings (Arabic + English) onto our canonical
// product/inventory fields, so pharmacies can upload their own sheets without
// a fixed template.
const HEADER_MAP = {
  barcode: "barcode",
  باركود: "barcode",
  "bar code": "barcode",
  sku: "barcode",

  name: "name",
  "product name": "name",
  الاسم: "name",
  "اسم المنتج": "name",
  "اسم الدواء": "name",
  الدواء: "name",

  activeingredient: "activeIngredient",
  "active ingredient": "activeIngredient",
  generic: "activeIngredient",
  "generic name": "activeIngredient",
  "المادة الفعالة": "activeIngredient",
  "المادة الفعّالة": "activeIngredient",

  category: "category",
  التصنيف: "category",
  الفئة: "category",

  form: "form",
  "الشكل الصيدلاني": "form",
  الشكل: "form",

  strength: "strength",
  التركيز: "strength",

  manufacturer: "manufacturer",
  "الشركة المصنعة": "manufacturer",
  الشركة: "manufacturer",

  price: "price",
  السعر: "price",
  "سعر البيع": "price",

  stock: "stock",
  quantity: "stock",
  qty: "stock",
  الكمية: "stock",
  المخزون: "stock",
};

const normalizeHeader = (h) =>
  String(h || "")
    .trim()
    .toLowerCase();

// Parse a spreadsheet file (xlsx/xls/csv) into normalized rows.
// Returns { rows, errors } where each row has canonical keys.
export const parseProductSheet = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { rows: [], errors: [{ row: 0, reason: "ملف فارغ" }] };

  const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
    raw: false,
  });

  const rows = [];
  const errors = [];

  raw.forEach((record, i) => {
    const rowNum = i + 2; // +1 for header, +1 for 1-based
    const mapped = {};
    for (const [key, value] of Object.entries(record)) {
      const canonical = HEADER_MAP[normalizeHeader(key)];
      if (canonical) mapped[canonical] = value;
    }

    const name = String(mapped.name || "").trim();
    const barcode = String(mapped.barcode || "").trim();

    if (!name && !barcode) {
      // skip fully-empty lines silently
      if (Object.values(mapped).every((v) => String(v).trim() === "")) return;
      errors.push({ row: rowNum, reason: "لا يوجد اسم أو باركود" });
      return;
    }

    const price = parseFloat(mapped.price);
    const stock = parseInt(mapped.stock, 10);

    rows.push({
      rowNum,
      barcode: barcode || undefined,
      name: name || undefined,
      activeIngredient: String(mapped.activeIngredient || "").trim(),
      category: String(mapped.category || "").trim() || "عام",
      form: String(mapped.form || "").trim(),
      strength: String(mapped.strength || "").trim(),
      manufacturer: String(mapped.manufacturer || "").trim(),
      price: Number.isFinite(price) ? price : 0,
      stock: Number.isFinite(stock) ? stock : 0,
    });
  });

  return { rows, errors };
};
