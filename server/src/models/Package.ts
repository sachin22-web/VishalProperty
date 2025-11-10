import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD'],
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    features: {
      type: [String],
      default: [],
    },
    listingLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

packageSchema.index({ isActive: 1, displayOrder: 1 });
packageSchema.index({ isPremium: 1 });

export default mongoose.model('Package', packageSchema);
