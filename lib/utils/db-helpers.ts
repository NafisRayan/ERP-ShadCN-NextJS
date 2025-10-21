import { Types } from 'mongoose';
import { PaginationParams, PaginatedResponse } from '@/types/common';

/**
 * Validate if a string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

/**
 * Convert string to ObjectId safely
 */
export function toObjectId(id: string | Types.ObjectId): Types.ObjectId {
  if (id instanceof Types.ObjectId) {
    return id;
  }
  return new Types.ObjectId(id);
}

/**
 * Build pagination query parameters
 */
export function buildPaginationQuery(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 50));
  const skip = (page - 1) * limit;

  const sort: Record<string, 1 | -1> = {};
  if (params.sortBy) {
    sort[params.sortBy] = params.sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = -1; // Default sort by creation date descending
  }

  return { page, limit, skip, sort };
}

/**
 * Build paginated response
 */
export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Sanitize MongoDB document for API response
 * Converts _id to id and removes __v
 */
export function sanitizeDocument<T extends Record<string, any>>(
  doc: T
): Omit<T, '__v'> & { id: string } {
  const sanitized: any = { ...doc };
  
  if (sanitized._id) {
    sanitized.id = sanitized._id.toString();
    delete sanitized._id;
  }
  
  delete sanitized.__v;
  
  return sanitized as Omit<T, '__v'> & { id: string };
}

/**
 * Build organization filter for multi-tenant queries
 */
export function buildOrgFilter(organizationId: string | Types.ObjectId) {
  return { organizationId: toObjectId(organizationId) };
}
