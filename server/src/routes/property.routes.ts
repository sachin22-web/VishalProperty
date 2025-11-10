import { Router } from "express";
import { verifyJWT, requireRole } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  createProperty,
  getMyProperties,
  getPublicProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  adminAllProperties,
  adminApprove,
  adminReject,
  adminTogglePremium,
  adminToggleVerified,
} from "../controllers/property.controller";

const router = Router();

/* ----------------------------- Public ------------------------------ */
// List public (approved) properties
router.get("/", getPublicProperties);

/* ------------------------------ User ------------------------------- */
// Create with images (multipart) or body URLs
router.post("/", verifyJWT, upload.array("images", 8), createProperty);

// My properties (creator’s own list)
router.get("/my", verifyJWT, getMyProperties);

// Update (can append images via upload)
router.put("/:id", verifyJWT, upload.array("images", 8), updateProperty);

// Delete (soft-delete)
router.delete("/:id", verifyJWT, deleteProperty);

/* ------------------------------ Admin ------------------------------ */
router.get("/admin/all", verifyJWT, requireRole("admin"), adminAllProperties);
router.put("/admin/:id/approve", verifyJWT, requireRole("admin"), adminApprove);
router.put("/admin/:id/reject", verifyJWT, requireRole("admin"), adminReject);
router.put("/admin/:id/verify", verifyJWT, requireRole("admin"), adminToggleVerified);
router.put("/admin/:id/premium", verifyJWT, requireRole("admin"), adminTogglePremium);

/* --------------------------- Public (ID) --------------------------- */
// IMPORTANT: keep this LAST so it doesn't capture /my or /admin/...
router.get("/:id", getPropertyById);

export default router;
