import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import Customer from '@/lib/db/models/Customer';
import SalesOrder from '@/lib/db/models/SalesOrder';
import Employee from '@/lib/db/models/Employee';
import mongoose from 'mongoose';

export interface SearchResult {
  id: string;
  type: 'product' | 'customer' | 'order' | 'employee';
  title: string;
  subtitle: string;
  description?: string;
  metadata?: Record<string, any>;
  score?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  groupedResults: {
    products: SearchResult[];
    customers: SearchResult[];
    orders: SearchResult[];
    employees: SearchResult[];
  };
}

export class SearchService {
  /**
   * Perform global search across all entities
   */
  static async globalSearch(
    query: string,
    organizationId: string,
    options: {
      limit?: number;
      entityTypes?: Array<'product' | 'customer' | 'order' | 'employee'>;
    } = {}
  ): Promise<SearchResponse> {
    await connectDB();

    const { limit = 20, entityTypes } = options;
    const searchLimit = Math.ceil(limit / 4); // Distribute limit across entity types

    const orgId = new mongoose.Types.ObjectId(organizationId);

    // Determine which entities to search
    const shouldSearchProducts = !entityTypes || entityTypes.includes('product');
    const shouldSearchCustomers = !entityTypes || entityTypes.includes('customer');
    const shouldSearchOrders = !entityTypes || entityTypes.includes('order');
    const shouldSearchEmployees = !entityTypes || entityTypes.includes('employee');

    // Execute searches in parallel
    const [products, customers, orders, employees] = await Promise.all([
      shouldSearchProducts ? this.searchProducts(query, orgId, searchLimit) : [],
      shouldSearchCustomers ? this.searchCustomers(query, orgId, searchLimit) : [],
      shouldSearchOrders ? this.searchOrders(query, orgId, searchLimit) : [],
      shouldSearchEmployees ? this.searchEmployees(query, orgId, searchLimit) : [],
    ]);

    // Combine and sort results by relevance score
    const allResults = [...products, ...customers, ...orders, ...employees];
    allResults.sort((a, b) => (b.score || 0) - (a.score || 0));

    return {
      results: allResults.slice(0, limit),
      totalCount: allResults.length,
      groupedResults: {
        products,
        customers,
        orders,
        employees,
      },
    };
  }

  /**
   * Search products
   */
  private static async searchProducts(
    query: string,
    organizationId: mongoose.Types.ObjectId,
    limit: number
  ): Promise<SearchResult[]> {
    const products = await Product.find(
      {
        $text: { $search: query },
        organizationId,
        isActive: true,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();

    return products.map((product) => ({
      id: product._id.toString(),
      type: 'product' as const,
      title: product.name,
      subtitle: `SKU: ${product.sku}`,
      description: product.description,
      metadata: {
        category: product.category,
        price: product.sellingPrice,
      },
      score: (product as any).score,
    }));
  }

  /**
   * Search customers
   */
  private static async searchCustomers(
    query: string,
    organizationId: mongoose.Types.ObjectId,
    limit: number
  ): Promise<SearchResult[]> {
    const customers = await Customer.find(
      {
        $text: { $search: query },
        organizationId,
        isActive: true,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();

    return customers.map((customer) => ({
      id: customer._id.toString(),
      type: 'customer' as const,
      title: customer.name,
      subtitle: customer.email,
      description: customer.company || customer.phone,
      metadata: {
        type: customer.type,
        phone: customer.phone,
      },
      score: (customer as any).score,
    }));
  }

  /**
   * Search sales orders
   */
  private static async searchOrders(
    query: string,
    organizationId: mongoose.Types.ObjectId,
    limit: number
  ): Promise<SearchResult[]> {
    const orders = await SalesOrder.find(
      {
        $text: { $search: query },
        organizationId,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .populate('customerId', 'name')
      .lean();

    return orders.map((order) => ({
      id: order._id.toString(),
      type: 'order' as const,
      title: order.orderNumber,
      subtitle: `Customer: ${(order.customerId as any)?.name || 'Unknown'}`,
      description: `Status: ${order.status} | Total: $${order.total.toFixed(2)}`,
      metadata: {
        status: order.status,
        total: order.total,
        orderDate: order.orderDate,
      },
      score: (order as any).score,
    }));
  }

  /**
   * Search employees
   */
  private static async searchEmployees(
    query: string,
    organizationId: mongoose.Types.ObjectId,
    limit: number
  ): Promise<SearchResult[]> {
    const employees = await Employee.find(
      {
        $text: { $search: query },
        organizationId,
        status: 'active',
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();

    return employees.map((employee) => ({
      id: employee._id.toString(),
      type: 'employee' as const,
      title: `${employee.firstName} ${employee.lastName}`,
      subtitle: employee.jobTitle,
      description: `${employee.department} | ${employee.email}`,
      metadata: {
        employeeId: employee.employeeId,
        department: employee.department,
        email: employee.email,
      },
      score: (employee as any).score,
    }));
  }

  /**
   * Get autocomplete suggestions
   */
  static async getAutocompleteSuggestions(
    query: string,
    organizationId: string,
    limit: number = 5
  ): Promise<SearchResult[]> {
    const response = await this.globalSearch(query, organizationId, { limit });
    return response.results;
  }
}
