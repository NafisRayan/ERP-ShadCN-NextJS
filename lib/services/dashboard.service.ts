import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import SalesOrder from '@/lib/db/models/SalesOrder';
import Product from '@/lib/db/models/Product';
import Customer from '@/lib/db/models/Customer';

export interface DashboardMetrics {
  revenue: {
    total: number;
    change: number;
  };
  expenses: {
    total: number;
    change: number;
  };
  sales: {
    total: number;
    change: number;
  };
  customers: {
    total: number;
    change: number;
  };
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface SalesData {
  name: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  type: 'sale' | 'customer' | 'product';
  description: string;
  amount?: number;
  timestamp: Date;
}

export class DashboardService {
  /**
   * Calculate KPI metrics for the dashboard
   */
  static async getMetrics(organizationId: string): Promise<DashboardMetrics> {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Calculate revenue (from completed sales orders)
    const currentRevenue = await SalesOrder.aggregate([
      {
        $match: {
          organizationId: orgId,
          status: { $in: ['completed', 'delivered'] },
          orderDate: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    const lastMonthRevenue = await SalesOrder.aggregate([
      {
        $match: {
          organizationId: orgId,
          status: { $in: ['completed', 'delivered'] },
          orderDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    const currentRevenueTotal = currentRevenue[0]?.total || 0;
    const lastMonthRevenueTotal = lastMonthRevenue[0]?.total || 0;
    const revenueChange = lastMonthRevenueTotal > 0
      ? ((currentRevenueTotal - lastMonthRevenueTotal) / lastMonthRevenueTotal) * 100
      : 0;

    // Calculate sales count
    const currentSales = await SalesOrder.countDocuments({
      organizationId: orgId,
      status: { $ne: 'cancelled' },
      orderDate: { $gte: startOfMonth },
    });

    const lastMonthSales = await SalesOrder.countDocuments({
      organizationId: orgId,
      status: { $ne: 'cancelled' },
      orderDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const salesChange = lastMonthSales > 0
      ? ((currentSales - lastMonthSales) / lastMonthSales) * 100
      : 0;

    // Calculate expenses (cost of goods sold)
    const currentExpenses = await SalesOrder.aggregate([
      {
        $match: {
          organizationId: orgId,
          status: { $in: ['completed', 'delivered'] },
          orderDate: { $gte: startOfMonth },
        },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
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
          total: {
            $sum: {
              $multiply: ['$items.quantity', '$product.costPrice'],
            },
          },
        },
      },
    ]);

    const lastMonthExpenses = await SalesOrder.aggregate([
      {
        $match: {
          organizationId: orgId,
          status: { $in: ['completed', 'delivered'] },
          orderDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
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
          total: {
            $sum: {
              $multiply: ['$items.quantity', '$product.costPrice'],
            },
          },
        },
      },
    ]);

    const currentExpensesTotal = currentExpenses[0]?.total || 0;
    const lastMonthExpensesTotal = lastMonthExpenses[0]?.total || 0;
    const expensesChange = lastMonthExpensesTotal > 0
      ? ((currentExpensesTotal - lastMonthExpensesTotal) / lastMonthExpensesTotal) * 100
      : 0;

    // Calculate customer count
    const currentCustomers = await Customer.countDocuments({
      organizationId: orgId,
      createdAt: { $gte: startOfMonth },
    });

    const lastMonthCustomers = await Customer.countDocuments({
      organizationId: orgId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const customersChange = lastMonthCustomers > 0
      ? ((currentCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      : 0;

    return {
      revenue: {
        total: currentRevenueTotal,
        change: revenueChange,
      },
      expenses: {
        total: currentExpensesTotal,
        change: expensesChange,
      },
      sales: {
        total: currentSales,
        change: salesChange,
      },
      customers: {
        total: currentCustomers,
        change: customersChange,
      },
    };
  }

  /**
   * Get revenue data for the last 6 months
   */
  static async getRevenueData(organizationId: string): Promise<RevenueData[]> {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const revenueData = await SalesOrder.aggregate([
      {
        $match: {
          organizationId: orgId,
          status: { $in: ['completed', 'delivered'] },
          orderDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
          },
          revenue: { $sum: '$total' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Format the data with month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return revenueData.map((item) => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue,
    }));
  }

  /**
   * Get sales overview by status
   */
  static async getSalesOverview(organizationId: string): Promise<SalesData[]> {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const salesByStatus = await SalesOrder.aggregate([
      {
        $match: {
          organizationId: orgId,
          orderDate: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusLabels: Record<string, string> = {
      draft: 'Draft',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };

    return salesByStatus.map((item) => ({
      name: statusLabels[item._id] || item._id,
      value: item.count,
    }));
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(organizationId: string, limit: number = 10): Promise<RecentActivity[]> {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    // Get recent sales orders
    const recentOrders = await SalesOrder.find({
      organizationId: orgId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('customerId', 'name')
      .lean();

    const activities: RecentActivity[] = recentOrders.map((order) => ({
      id: order._id.toString(),
      type: 'sale' as const,
      description: `New order ${order.orderNumber} from ${(order.customerId as any)?.name || 'Unknown'}`,
      amount: order.total,
      timestamp: order.createdAt,
    }));

    // Sort by timestamp
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return activities.slice(0, limit);
  }
}
