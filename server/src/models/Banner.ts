import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  order: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1, order: 1 });

export default mongoose.model<IBanner>('Banner', bannerSchema);
