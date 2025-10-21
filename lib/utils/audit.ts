import { Types } from 'mongoose';
import AuditLogModel from '@/lib/db/models/AuditLog';

interface AuditLogParams {
  organizationId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: Types.ObjectId | string;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

/**
 * Create an audit log entry
 * @param params - Audit log parameters
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await AuditLogModel.create({
      organizationId: new Types.ObjectId(params.organizationId),
      userId: new Types.ObjectId(params.userId),
      action: params.action,
      entityType: params.entityType,
      entityId: new Types.ObjectId(params.entityId),
      changes: params.changes,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent audit logging from breaking main operations
  }
}

/**
 * Get audit logs for a specific entity
 * @param organizationId - Organization ID
 * @param entityType - Type of entity
 * @param entityId - Entity ID
 * @param limit - Maximum number of logs to return
 */
export async function getEntityAuditLogs(
  organizationId: Types.ObjectId | string,
  entityType: string,
  entityId: Types.ObjectId | string,
  limit: number = 50
) {
  try {
    const logs = await AuditLogModel.find({
      organizationId: new Types.ObjectId(organizationId),
      entityType,
      entityId: new Types.ObjectId(entityId),
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .lean();

    return logs;
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
}

/**
 * Calculate field-level changes between old and new objects
 * @param oldObj - Previous state of the object
 * @param newObj - New state of the object
 */
export function calculateChanges(
  oldObj: Record<string, any>,
  newObj: Record<string, any>
): Record<string, any> {
  const changes: Record<string, any> = {};

  // Check for modified and new fields
  for (const key in newObj) {
    if (key === '_id' || key === '__v' || key === 'updatedAt') continue;
    
    if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      changes[key] = {
        old: oldObj[key],
        new: newObj[key],
      };
    }
  }

  // Check for deleted fields
  for (const key in oldObj) {
    if (key === '_id' || key === '__v' || key === 'updatedAt') continue;
    
    if (!(key in newObj)) {
      changes[key] = {
        old: oldObj[key],
        new: null,
      };
    }
  }

  return changes;
}
