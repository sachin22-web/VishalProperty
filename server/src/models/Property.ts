import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPropertyDocument extends Document {
  userId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  propertyType: 'Apartment' | 'House' | 'Plot' | 'Commercial' | 'Rent';
  price: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  amenities?: string[];
  location: string;
  city?: string;
  images: string[];
  coverImageUrl?: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'expired';
  badges?: { premium?: boolean; verified?: boolean };
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IPropertyDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, index: true },
    description: { type: String, required: true },
    propertyType: { type: String, enum: ['Apartment', 'House', 'Plot', 'Commercial', 'Rent'], required: true },
    price: { type: Number, required: true },
    area: { type: Number },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    furnishing: { type: String },
    amenities: [{ type: String }],
    location: { type: String, required: true },
    city: { type: String },
    images: [{ type: String }],
    coverImageUrl: { type: String },
    status: { type: String, enum: ['draft', 'pending_review', 'approved', 'rejected', 'expired'], default: 'draft', index: true },
    badges: {
      premium: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PropertySchema.index({ city: 1, status: 1 });
PropertySchema.index({ title: 'text', description: 'text', location: 'text' });

const PropertyModel: Model<IPropertyDocument> = mongoose.models.Property || mongoose.model<IPropertyDocument>('Property', PropertySchema);
export default PropertyModel;
