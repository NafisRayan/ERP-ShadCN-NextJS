import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import Product, { IProduct } from '@/lib/db/models/Product';
import StockLevel from '@/lib/db/models/StockLevel';
import { ProductInput, UpdateProductInput } from '@/lib/validations/product';

export class ProductService {
  /**
   * Get all products for an organization
   */
  static async getProducts(
    organizationId: string,
    filters?: {
      search?: string;
      category?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    const query: any = { organizationId: orgId };

    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(productId: string, organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const prodId = new mongoose.Types.ObjectId(productId);

    const product = await Product.findOne({
      _id: prodId,
      organizationId: orgId,
    }).lean();

    if (!product) {
      throw new Error('Product not found');
    }

    // Get stock levels across all warehouses
    const stockLevels = await StockLevel.find({
      productId: prodId,
      organizationId: orgId,
    })
      .populate('warehouseId', 'name location')
      .lean();

    const totalStock = stockLevels.reduce((sum, stock) => sum + stock.quantity, 0);

    return {
      ...product,
      stockLevels,
      totalStock,
    };
  }

  /**
   * Create a new product
   */
  static async createProduct(data: ProductInput, organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    // Check if SKU already exists
    const existing = await Product.findOne({
      sku: data.sku,
      organizationId: orgId,
    });

    if (existing) {
      throw new Error('Product with this SKU already exists');
    }

    const product = await Product.create({
      ...data,
      organizationId: orgId,
    });

    return product.toObject();
  }

  /**
   * Update a product
   */
  static async updateProduct(
    productId: string,
    data: UpdateProductInput,
    organizationId: string
  ) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const prodId = new mongoose.Types.ObjectId(productId);

    // If SKU is being updated, check for duplicates
    if (data.sku) {
      const existing = await Product.findOne({
        sku: data.sku,
        organizationId: orgId,
        _id: { $ne: prodId },
      });

      if (existing) {
        throw new Error('Product with this SKU already exists');
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: prodId, organizationId: orgId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new Error('Product not found');
    }

    return product.toObject();
  }

  /**
   * Delete a product (soft delete by setting isActive to false)
   */
  static async deleteProduct(productId: string, organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const prodId = new mongoose.Types.ObjectId(productId);

    const product = await Product.findOneAndUpdate(
      { _id: prodId, organizationId: orgId },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!product) {
      throw new Error('Product not found');
    }

    return { message: 'Product deleted successfully' };
  }

  /**
   * Get product categories
   */
  static async getCategories(organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    const categories = await Product.distinct('category', {
      organizationId: orgId,
      isActive: true,
    });

    return categories.sort();
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    const products = await Product.find({
      organizationId: orgId,
      isActive: true,
    }).lean();

    const lowStockProducts = [];

    for (const product of products) {
      const stockLevels = await StockLevel.find({
        productId: product._id,
        organizationId: orgId,
      }).lean();

      const totalStock = stockLevels.reduce((sum, stock) => sum + stock.quantity, 0);

      if (totalStock <= product.reorderLevel) {
        lowStockProducts.push({
          ...product,
          totalStock,
          stockLevels,
        });
      }
    }

    return lowStockProducts;
  }
}
