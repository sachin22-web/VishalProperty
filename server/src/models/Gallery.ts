import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  src: string;
  title: string;
  category: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    src: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGallery>("Gallery", GallerySchema);
