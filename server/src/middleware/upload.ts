import path from "path";
import fs from "fs";
import multer from "multer";

const uploadRoot = path.join(process.cwd(), "uploads", "properties");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (/^image\//.test(file.mimetype)) return cb(null, true);
  cb(new Error("Only image files are allowed"));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });
