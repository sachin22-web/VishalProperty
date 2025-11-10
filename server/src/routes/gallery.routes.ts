import { Router } from "express";
import { verifyJWT, requireRole } from "../middleware/auth";
import {
  listPublic,
  listAllAdmin,
  createItem,
  updateItem,
  deleteItem,
  reorderItems,
} from "../controllers/gallery.controller";

const router = Router();

/* -------- Public -------- */
router.get("/", listPublic);

/* -------- Admin -------- */
router.get("/admin/all", verifyJWT, requireRole("admin"), listAllAdmin);
router.post("/", verifyJWT, requireRole("admin"), createItem);
router.put("/reorder", verifyJWT, requireRole("admin"), reorderItems);
router.put("/:id", verifyJWT, requireRole("admin"), updateItem);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteItem);

export default router;
