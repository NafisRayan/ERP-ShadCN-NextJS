import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStockLevel extends Document {
  organizationId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  warehouseId: mongoose.Types.ObjectId;
  quantity: number;
  updatedAt: Date;
}

const StockLevelSchema = new Schema<IStockLevel>(
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
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 0,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

// Indexes
StockLevelSchema.index({ organizationId: 1 });
StockLevelSchema.index({ productId: 1, warehouseId: 1, organizationId: 1 }, { unique: true });
StockLevelSchema.index({ warehouseId: 1 });

const StockLevel: Model<IStockLevel> =
  mongoose.models.StockLevel || mongoose.model<IStockLevel>('StockLevel', StockLevelSchema);

export default StockLevel;
