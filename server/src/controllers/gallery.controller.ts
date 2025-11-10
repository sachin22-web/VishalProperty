import { Request, Response } from "express";
import { Gallery } from "../models/Gallery";

export const listPublic = async (_req: Request, res: Response) => {
  const items = await Gallery.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(items);
};

export const listAllAdmin = async (_req: Request, res: Response) => {
  const items = await Gallery.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(items);
};

export const createItem = async (req: Request, res: Response) => {
  const { src, title, category, order } = req.body || {};
  if (!src || !title || !category) {
    return res.status(400).json({ message: "src, title, category are required" });
  }
  const doc = await Gallery.create({ src, title, category, order: Number(order) || 0 });
  res.status(201).json(doc);
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { src, title, category, order } = req.body || {};
  const doc = await Gallery.findByIdAndUpdate(
    id,
    { ...(src && { src }), ...(title && { title }), ...(category && { category }), ...(order !== undefined && { order }) },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json(doc);
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const doc = await Gallery.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ success: true });
};

export const reorderItems = async (req: Request, res: Response) => {
  const items: Array<{ _id: string; order: number }> = req.body?.items || [];
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "items[] required" });
  }
  await Gallery.bulkWrite(
    items.map((it) => ({
      updateOne: {
        filter: { _id: it._id },
        update: { $set: { order: Number(it.order) || 0 } },
      },
    }))
  );
  res.json({ success: true });
};
