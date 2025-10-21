import mongoose, { FilterQuery } from 'mongoose';

/**
 * Utilities for organization-based data isolation
 */

/**
 * Add organization filter to a query
 * Ensures all queries are scoped to the user's organization
 */
export function addOrganizationFilter<T>(
  query: FilterQuery<T>,
  organizationId: string
): FilterQuery<T> {
  return {
    ...query,
    organizationId: new mongoose.Types.ObjectId(organizationId),
  };
}

/**
 * Validate that an entity belongs to the user's organization
 */
export async function validateOrganizationAccess<T extends { organizationId: mongoose.Types.ObjectId }>(
  model: mongoose.Model<T>,
  entityId: string,
  organizationId: string
): Promise<boolean> {
  const entity = await model.findOne({
    _id: entityId,
    organizationId: new mongoose.Types.ObjectId(organizationId),
  }).lean();

  return !!entity;
}

/**
 * Create a scoped query builder for a model
 * Automatically adds organization filter to all queries
 */
export function createScopedQuery<T>(
  model: mongoose.Model<T>,
  organizationId: string
) {
  const orgId = new mongoose.Types.ObjectId(organizationId);

  return {
    find: (filter: FilterQuery<T> = {}) => {
      return model.find({ ...filter, organizationId: orgId });
    },
    findOne: (filter: FilterQuery<T> = {}) => {
      return model.findOne({ ...filter, organizationId: orgId });
    },
    findById: (id: string) => {
      return model.findOne({ _id: id, organizationId: orgId });
    },
    count: (filter: FilterQuery<T> = {}) => {
      return model.countDocuments({ ...filter, organizationId: orgId });
    },
    create: (data: Partial<T>) => {
      return model.create({ ...data, organizationId: orgId });
    },
    updateOne: (filter: FilterQuery<T>, update: any) => {
      return model.updateOne({ ...filter, organizationId: orgId }, update);
    },
    updateMany: (filter: FilterQuery<T>, update: any) => {
      return model.updateMany({ ...filter, organizationId: orgId }, update);
    },
    deleteOne: (filter: FilterQuery<T>) => {
      return model.deleteOne({ ...filter, organizationId: orgId });
    },
    deleteMany: (filter: FilterQuery<T>) => {
      return model.deleteMany({ ...filter, organizationId: orgId });
    },
  };
}

/**
 * Middleware to ensure organization isolation in API routes
 * Use this to validate that entity IDs in request belong to user's organization
 */
export async function ensureOrganizationAccess<T extends { organizationId: mongoose.Types.ObjectId }>(
  model: mongoose.Model<T>,
  entityIds: string | string[],
  organizationId: string
): Promise<void> {
  const ids = Array.isArray(entityIds) ? entityIds : [entityIds];
  const orgId = new mongoose.Types.ObjectId(organizationId);

  const count = await model.countDocuments({
    _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    organizationId: orgId,
  });

  if (count !== ids.length) {
    throw new Error('Access denied: One or more entities do not belong to your organization');
  }
}

/**
 * Get organization context from session
 * Helper to extract organization ID from authenticated session
 */
export function getOrganizationContext(session: any): {
  organizationId: string;
  userId: string;
} {
  if (!session || !session.user) {
    throw new Error('Authentication required');
  }

  const { id: userId, organizationId } = session.user;

  if (!organizationId) {
    throw new Error('Organization context not found');
  }

  return { organizationId, userId };
}
