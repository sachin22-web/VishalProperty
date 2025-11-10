import { Router } from "express";
import { Types } from "mongoose";
import Enquiry from "../models/Enquiry";
// import { requireAdmin } from "../middleware/auth"; // enable if you have it

const router = Router();

// Public: create enquiry (property/contact form)
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, message, source, propertyId } = req.body || {};
    const doc = await Enquiry.create({
      name,
      email,
      phone,
      message,
      source: source || "contactForm",
      propertyId: propertyId && Types.ObjectId.isValid(propertyId) ? propertyId : null,
    });
    res.status(201).json({ success: true, id: doc._id });
  } catch (e) {
    next(e);
  }
});

// Admin list (search + filter)
// router.use(requireAdmin);
router.get("/", async (req, res, next) => {
  try {
    const { q, status } = req.query as { q?: string; status?: "new" | "reviewed" | "closed" };
    const filter: any = {};
    if (status && ["new", "reviewed", "closed"].includes(status)) filter.status = status;
    if (q && q.trim()) {
      const r = new RegExp(q.trim(), "i");
      filter.$or = [{ name: r }, { phone: r }, { email: r }, { message: r }];
    }

    const items = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .populate("propertyId", "title slug")
      .lean();

    // return plain array (frontend normalizes anyway)
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// Get one
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
    const item = await Enquiry.findById(id).populate("propertyId", "title slug").lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

// Update status
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: "new" | "reviewed" | "closed" };
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
    if (!status || !["new", "reviewed", "closed"].includes(status))
      return res.status(400).json({ message: 'status must be "new"|"reviewed"|"closed"' });

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).populate("propertyId", "title slug").lean();

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
    const del = await Enquiry.findByIdAndDelete(id).lean();
    if (!del) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
