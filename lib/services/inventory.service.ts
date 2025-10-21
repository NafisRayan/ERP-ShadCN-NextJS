import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import InventoryTransaction from '@/lib/db/models/InventoryTransaction';
import StockLevel from '@/lib/db/models/StockLevel';
import Product from '@/lib/db/models/Product';
import Warehouse from '@/lib/db/models/Warehouse';

export class InventoryService {
  /**
   * Record an inventory transaction and update stock levels
   */
  static async recordTransaction(
    data: {
      productId: string;
      warehouseId: string;
      type: 'in' | 'out' | 'adjustment';
      quantity: number;
      referenceType: 'purchase' | 'sale' | 'transfer' | 'adjustment';
      referenceId?: string;
      notes?: string;
    },
    userId: string,
    organizationId: string
  ) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const orgId = new mongoose.Types.ObjectId(organizationId);
      const prodId = new mongoose.Types.ObjectId(data.productId);
      const warehouseId = new mongoose.Types.ObjectId(data.warehouseId);
      const userObjId = new mongoose.Types.ObjectId(userId);

      // Verify product and warehouse exist
      const [product, warehouse] = await Promise.all([
        Product.findOne({ _id: prodId, organizationId: orgId }),
        Warehouse.findOne({ _id: warehouseId, organizationId: orgId }),
      ]);

      if (!product) throw new Error('Product not found');
      if (!warehouse) throw new Error('Warehouse not found');

      // Create transaction record
      const transaction = await InventoryTransaction.create(
        [
          {
            organizationId: orgId,
            productId: prodId,
            warehouseId,
            type: data.type,
            quantity: data.quantity,
            referenceType: data.referenceType,
            referenceId: data.referenceId
              ? new mongoose.Types.ObjectId(data.referenceId)
              : undefined,
            userId: userObjId,
            notes: data.notes,
          },
        ],
        { session }
      );

      // Calculate quantity change
      let quantityChange = 0;
      if (data.type === 'in') {
        quantityChange = data.quantity;
      } else if (data.type === 'out') {
        quantityChange = -data.quantity;
      } else if (data.type === 'adjustment') {
        quantityChange = data.quantity;
      }

      // Update stock level
      const stockLevel = await StockLevel.findOneAndUpdate(
        {
          productId: prodId,
          warehouseId,
          organizationId: orgId,
        },
        {
          $inc: { quantity: quantityChange },
          $setOnInsert: {
            productId: prodId,
            warehouseId,
            organizationId: orgId,
          },
        },
        {
          upsert: true,
          new: true,
          session,
        }
      );

      // Ensure stock doesn't go negative
      if (stockLevel.quantity < 0) {
        throw new Error('Insufficient stock');
      }

      await session.commitTransaction();
      return transaction[0].toObject();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get stock levels for a product across all warehouses
   */
  static async getStockLevels(productId: string, organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const prodId = new mongoose.Types.ObjectId(productId);

    const stockLevels = await StockLevel.find({
      productId: prodId,
      organizationId: orgId,
    })
      .populate('warehouseId', 'name location')
      .lean();

    return stockLevels;
  }

  /**
   * Get transaction history for a product
   */
  static async getTransactionHistory(
    productId: string,
    organizationId: string,
    filters?: {
      warehouseId?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const prodId = new mongoose.Types.ObjectId(productId);

    const query: any = {
      productId: prodId,
      organizationId: orgId,
    };

    if (filters?.warehouseId) {
      query.warehouseId = new mongoose.Types.ObjectId(filters.warehouseId);
    }

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    const limit = filters?.limit || 100;

    const transactions = await InventoryTransaction.find(query)
      .populate('warehouseId', 'name location')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return transactions;
  }

  /**
   * Transfer stock between warehouses
   */
  static async transferStock(
    data: {
      productId: string;
      fromWarehouseId: string;
      toWarehouseId: string;
      quantity: number;
      notes?: string;
    },
    userId: string,
    organizationId: string
  ) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Record outbound transaction
      await this.recordTransaction(
        {
          productId: data.productId,
          warehouseId: data.fromWarehouseId,
          type: 'out',
          quantity: data.quantity,
          referenceType: 'transfer',
          notes: `Transfer to warehouse ${data.toWarehouseId}. ${data.notes || ''}`,
        },
        userId,
        organizationId
      );

      // Record inbound transaction
      await this.recordTransaction(
        {
          productId: data.productId,
          warehouseId: data.toWarehouseId,
          type: 'in',
          quantity: data.quantity,
          referenceType: 'transfer',
          notes: `Transfer from warehouse ${data.fromWarehouseId}. ${data.notes || ''}`,
        },
        userId,
        organizationId
      );

      await session.commitTransaction();
      return { message: 'Stock transferred successfully' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Adjust stock level (for corrections)
   */
  static async adjustStock(
    data: {
      productId: string;
      warehouseId: string;
      newQuantity: number;
      notes?: string;
    },
    userId: string,
    organizationId: string
  ) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const prodId = new mongoose.Types.ObjectId(data.productId);
    const warehouseId = new mongoose.Types.ObjectId(data.warehouseId);

    // Get current stock level
    const currentStock = await StockLevel.findOne({
      productId: prodId,
      warehouseId,
      organizationId: orgId,
    });

    const currentQuantity = currentStock?.quantity || 0;
    const adjustment = data.newQuantity - currentQuantity;

    if (adjustment === 0) {
      return { message: 'No adjustment needed' };
    }

    // Record adjustment transaction
    await this.recordTransaction(
      {
        productId: data.productId,
        warehouseId: data.warehouseId,
        type: 'adjustment',
        quantity: adjustment,
        referenceType: 'adjustment',
        notes: data.notes || `Adjusted from ${currentQuantity} to ${data.newQuantity}`,
      },
      userId,
      organizationId
    );

    return { message: 'Stock adjusted successfully', adjustment };
  }

  /**
   * Get inventory valuation
   */
  static async getInventoryValuation(organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    const valuation = await StockLevel.aggregate([
      {
        $match: { organizationId: orgId },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $group: {
          _id: null,
          totalCostValue: {
            $sum: { $multiply: ['$quantity', '$product.costPrice'] },
          },
          totalSellingValue: {
            $sum: { $multiply: ['$quantity', '$product.sellingPrice'] },
          },
          totalItems: { $sum: '$quantity' },
        },
      },
    ]);

    return valuation[0] || {
      totalCostValue: 0,
      totalSellingValue: 0,
      totalItems: 0,
    };
  }
}
