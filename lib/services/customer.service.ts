import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import Customer, { ICustomer } from '@/lib/db/models/Customer';
import { CustomerInput, UpdateCustomerInput } from '@/lib/validations/customer';

export class CustomerService {
  /**
   * Get all customers for an organization
   */
  static async getCustomers(
    organizationId: string,
    filters?: {
      search?: string;
      type?: string;
      isActive?: boolean;
      tags?: string[];
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

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Customer.countDocuments(query),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single customer by ID
   */
  static async getCustomerById(customerId: string, organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const custId = new mongoose.Types.ObjectId(customerId);

    const customer = await Customer.findOne({
      _id: custId,
      organizationId: orgId,
    }).lean();

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }

  /**
   * Create a new customer
   */
  static async createCustomer(data: CustomerInput, organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    // Check if email already exists
    const existing = await Customer.findOne({
      email: data.email,
      organizationId: orgId,
    });

    if (existing) {
      throw new Error('Customer with this email already exists');
    }

    const customer = await Customer.create({
      ...data,
      organizationId: orgId,
    });

    return customer.toObject();
  }

  /**
   * Update a customer
   */
  static async updateCustomer(
    customerId: string,
    data: UpdateCustomerInput,
    organizationId: string
  ) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const custId = new mongoose.Types.ObjectId(customerId);

    // If email is being updated, check for duplicates
    if (data.email) {
      const existing = await Customer.findOne({
        email: data.email,
        organizationId: orgId,
        _id: { $ne: custId },
      });

      if (existing) {
        throw new Error('Customer with this email already exists');
      }
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: custId, organizationId: orgId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer.toObject();
  }

  /**
   * Delete a customer (soft delete)
   */
  static async deleteCustomer(customerId: string, organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const custId = new mongoose.Types.ObjectId(customerId);

    const customer = await Customer.findOneAndUpdate(
      { _id: custId, organizationId: orgId },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!customer) {
      throw new Error('Customer not found');
    }

    return { message: 'Customer deleted successfully' };
  }

  /**
   * Get customer tags
   */
  static async getTags(organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    const tags = await Customer.distinct('tags', {
      organizationId: orgId,
      isActive: true,
    });

    return tags.sort();
  }

  /**
   * Get customer statistics
   */
  static async getCustomerStats(organizationId: string) {
    await connectDB();
    const orgId = new mongoose.Types.ObjectId(organizationId);

    const stats = await Customer.aggregate([
      {
        $match: { organizationId: orgId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: ['$isActive', 1, 0] },
          },
          individual: {
            $sum: { $cond: [{ $eq: ['$type', 'individual'] }, 1, 0] },
          },
          company: {
            $sum: { $cond: [{ $eq: ['$type', 'company'] }, 1, 0] },
          },
        },
      },
    ]);

    return stats[0] || {
      total: 0,
      active: 0,
      individual: 0,
      company: 0,
    };
  }
}
