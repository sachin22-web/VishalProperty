import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import enquiryRoutes from "./routes/enquiry.routes";
import userRoutes from "./routes/user.routes";
import pageRoutes from "./routes/page.routes";
import transactionRoutes from "./routes/transaction.routes";
import packageRoutes from "./routes/package.routes";
import paymentRoutes from "./routes/payment.routes";
import bannerRoutes from "./routes/banner.routes";
import galleryRoutes from "./routes/gallery.routes";


dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:8080";

// trust proxy if behind nginx
app.set("trust proxy", 1);

// CORS (allow comma-separated list in env)
const allowedOrigins = CORS_ORIGIN.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman/Server-to-server
      return cb(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  })
);

// Body parsers (higher limits so big forms/base64 don't choke)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded images publicly (used by property images)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(MONGODB_URI);
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/gallery", galleryRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "Route not found" });
  }
  next();
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  const publicBase =
    process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
  console.log(`\n✓ Server running on ${publicBase}`);
  console.log(`✓ CORS enabled for: ${allowedOrigins.join(", ")}`);
  console.log(`✓ Uploads served at ${publicBase}/uploads\n`);
});

export default app;
