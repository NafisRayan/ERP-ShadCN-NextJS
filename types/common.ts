import { Types } from 'mongoose';

/**
 * Common address interface used across multiple entities
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Emergency contact information for employees
 */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

/**
 * Audit log entry for tracking all system changes
 */
export interface AuditLog {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: Types.ObjectId;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

/**
 * Base interface for all entities with organization isolation
 */
export interface BaseEntity {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
