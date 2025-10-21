import mongoose, { Schema, Document, Model } from 'mongoose';

export type TransactionType = 'in' | 'out' | 'adjustment';
export type ReferenceType = 'purchase' | 'sale' | 'transfer' | 'adjustment';

export interface IInventoryTransaction extends Document {
  organizationId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  warehouseId: mongoose.Types.ObjectId;
  type: TransactionType;
  quantity: number;
  referenceType: ReferenceType;
  referenceId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    warehouseId: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Warehouse is required'],
    },
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment'],
      required: [true, 'Transaction type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    referenceType: {
      type: String,
      enum: ['purchase', 'sale', 'transfer', 'adjustment'],
      required: [true, 'Reference type is required'],
    },
    referenceId: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
InventoryTransactionSchema.index({ organizationId: 1, createdAt: -1 });
InventoryTransactionSchema.index({ productId: 1, warehouseId: 1 });
InventoryTransactionSchema.index({ warehouseId: 1 });
InventoryTransactionSchema.index({ referenceType: 1, referenceId: 1 });

const InventoryTransaction: Model<IInventoryTransaction> =
  mongoose.models.InventoryTransaction ||
  mongoose.model<IInventoryTransaction>('InventoryTransaction', InventoryTransactionSchema);

export default InventoryTransaction;
