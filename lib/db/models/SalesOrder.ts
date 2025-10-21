import mongoose, { Schema, Document, Model } from 'mongoose';
import { Address } from '@/types/common';

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface ISalesOrder extends Document {
  organizationId: mongoose.Types.ObjectId;
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  orderDate: Date;
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  shippingAddress: Address;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const SalesOrderSchema = new Schema<ISalesOrder>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    orderDate: {
      type: Date,
      required: [true, 'Order date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'],
      default: 'draft',
    },
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: (items: OrderItem[]) => items.length > 0,
        message: 'Order must have at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending',
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SalesOrderSchema.index({ organizationId: 1 });
SalesOrderSchema.index({ orderNumber: 1, organizationId: 1 }, { unique: true });
SalesOrderSchema.index({ customerId: 1 });
SalesOrderSchema.index({ status: 1 });
SalesOrderSchema.index({ orderDate: -1 });

// Text index for search
SalesOrderSchema.index({ 
  orderNumber: 'text', 
  notes: 'text'
});

const SalesOrder: Model<ISalesOrder> =
  mongoose.models.SalesOrder || mongoose.model<ISalesOrder>('SalesOrder', SalesOrderSchema);

export default SalesOrder;
