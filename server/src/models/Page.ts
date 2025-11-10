import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IPage>('Page', pageSchema);
