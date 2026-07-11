import reshaper from "arabic-persian-reshaper";
import bidiFactory from "bidi-js";

const bidi = bidiFactory();

export const rtl = (text = "") => {
  if (!text) return "";

  const shaped = reshaper.ArabicShaper.convertArabic(String(text));

  const levels = bidi.getEmbeddingLevels(shaped);

  return bidi.getReorderedString(shaped, levels);
};

