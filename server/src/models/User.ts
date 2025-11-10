import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  passwordHash: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    phone: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user', index: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

const UserModel: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export default UserModel;
