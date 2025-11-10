import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITransactionDocument extends Document {
  userId: Types.ObjectId;
  propertyId?: Types.ObjectId | null;
  packageId?: Types.ObjectId | null;
  amount: number; // in INR rupees
  currency: string; // INR
  gateway: 'razorpay' | 'phonepe' | 'test';
  gatewayRef: string; // order id or payment id
  status: 'pending' | 'success' | 'failed' | 'refunded';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', default: null },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', default: null },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    gateway: { type: String, enum: ['razorpay', 'phonepe', 'test'], default: 'razorpay' },
    gatewayRef: { type: String, required: true, index: true },
    status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending', index: true },
    notes: { type: String },
  },
  { timestamps: true }
);

TransactionSchema.index({ status: 1, createdAt: -1 });

const TransactionModel: Model<ITransactionDocument> = mongoose.models.Transaction || mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);
export default TransactionModel;
