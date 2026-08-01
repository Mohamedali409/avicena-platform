import multer from "multer";
import path from "path";
import fs from "fs";

const DIR = "uploads/voice";
fs.mkdirSync(DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Browsers record webm (Chrome/Firefox) or mp4 (Safari); keep the real ext.
    const ext =
      path.extname(file.originalname) ||
      (file.mimetype.includes("mp4") || file.mimetype.includes("mpeg")
        ? ".mp4"
        : ".webm");
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/")) cb(null, true);
  else cb(new Error("ملف صوتي فقط مسموح"), false);
};

const uploadVoice = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

export default uploadVoice;
