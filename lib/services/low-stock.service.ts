import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import StockLevel from '@/lib/db/models/StockLevel';
import { NotificationService } from './notification.service';

export class LowStockService {
  /**
   * Get all low stock products for an organization
   */
  static async getLowStockProducts(organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    const lowStockProducts = await Product.aggregate([
      {
        $match: {
          organizationId: orgId,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: 'stocklevels',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$productId', '$$productId'] },
                    { $eq: ['$organizationId', orgId] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: 'warehouses',
                localField: 'warehouseId',
                foreignField: '_id',
                as: 'warehouse',
              },
            },
            {
              $unwind: '$warehouse',
            },
          ],
          as: 'stockLevels',
        },
      },
      {
        $addFields: {
          totalStock: {
            $sum: '$stockLevels.quantity',
          },
        },
      },
      {
        $match: {
          $expr: {
            $lte: ['$totalStock', '$reorderLevel'],
          },
        },
      },
      {
        $sort: { totalStock: 1 },
      },
    ]);

    return lowStockProducts;
  }

  /**
   * Check for low stock and generate notifications
   */
  static async checkAndNotify(organizationId: string) {
    await connectDB();
    const lowStockProducts = await this.getLowStockProducts(organizationId);

    const notifications = [];

    for (const product of lowStockProducts) {
      const notification = await NotificationService.createLowStockNotification(
        product._id.toString(),
        product.name,
        product.totalStock,
        product.reorderLevel,
        organizationId
      );

      notifications.push(notification);
    }

    return {
      count: notifications.length,
      notifications,
    };
  }

  /**
   * Get reorder suggestions based on sales velocity
   */
  static async getReorderSuggestions(organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    // Get low stock products
    const lowStockProducts = await this.getLowStockProducts(organizationId);

    // Calculate suggested reorder quantities
    // For now, suggest 2x the reorder level
    const suggestions = lowStockProducts.map((product) => ({
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      currentStock: product.totalStock,
      reorderLevel: product.reorderLevel,
      suggestedQuantity: Math.max(product.reorderLevel * 2, 10),
      stockLevels: product.stockLevels,
    }));

    return suggestions;
  }

  /**
   * Get low stock statistics
   */
  static async getLowStockStats(organizationId: string) {
    await connectDB();
    const lowStockProducts = await this.getLowStockProducts(organizationId);

    const criticalStock = lowStockProducts.filter((p) => p.totalStock === 0);
    const lowStock = lowStockProducts.filter(
      (p) => p.totalStock > 0 && p.totalStock <= p.reorderLevel
    );

    return {
      total: lowStockProducts.length,
      critical: criticalStock.length,
      low: lowStock.length,
      products: lowStockProducts,
    };
  }
}
