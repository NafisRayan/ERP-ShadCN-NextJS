import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  organizationId: mongoose.Types.ObjectId;
  sku: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  barcode?: string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      default: 'pcs',
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: 0,
    },
    reorderLevel: {
      type: Number,
      default: 10,
      min: 0,
    },
    barcode: {
      type: String,
      trim: true,
    },
    images: {
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
ProductSchema.index({ organizationId: 1 });
ProductSchema.index({ sku: 1, organizationId: 1 }, { unique: true });
ProductSchema.index({ isActive: 1 });

// Text index for search
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  sku: 'text',
  category: 'text',
  barcode: 'text'
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
