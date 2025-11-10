import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  status: "new" | "reviewed" | "closed";
  source?: "property" | "contactForm" | "whatsapp";
  propertyId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
    status: { type: String, enum: ["new", "reviewed", "closed"], default: "new", index: true },
    source: { type: String, enum: ["property", "contactForm", "whatsapp"], default: "contactForm" },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", default: null },
  },
  { timestamps: true }
);

export default (mongoose.models.Enquiry as mongoose.Model<IEnquiry>) ||
  mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
