import mongoose, { Schema, Document, Model } from 'mongoose';
import { Address } from '@/types/common';

export interface ICustomer extends Document {
  organizationId: mongoose.Types.ObjectId;
  type: 'individual' | 'company';
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: Address;
  taxId?: string;
  paymentTerms: number;
  creditLimit?: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    type: {
      type: String,
      enum: ['individual', 'company'],
      required: [true, 'Customer type is required'],
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    taxId: {
      type: String,
      trim: true,
    },
    paymentTerms: {
      type: Number,
      default: 30,
      min: 0,
    },
    creditLimit: {
      type: Number,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CustomerSchema.index({ organizationId: 1 });
CustomerSchema.index({ email: 1, organizationId: 1 });
CustomerSchema.index({ isActive: 1 });

// Text index for search
CustomerSchema.index({ 
  name: 'text', 
  email: 'text', 
  phone: 'text',
  company: 'text',
  taxId: 'text'
});

const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
