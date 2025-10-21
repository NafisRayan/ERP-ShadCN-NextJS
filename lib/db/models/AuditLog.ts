import mongoose, { Schema, Model } from 'mongoose';
import { AuditLog } from '@/types/common';

const auditLogSchema = new Schema<AuditLog>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete'],
      required: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    changes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'audit_logs',
  }
);

// Compound indexes for common queries
auditLogSchema.index({ organizationId: 1, createdAt: -1 });
auditLogSchema.index({ organizationId: 1, entityType: 1, entityId: 1 });
auditLogSchema.index({ organizationId: 1, userId: 1, createdAt: -1 });

// TTL index for automatic deletion after 7 years (as per requirement 14.4)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 220752000 }); // 7 years in seconds

const AuditLogModel: Model<AuditLog> =
  mongoose.models.AuditLog || mongoose.model<AuditLog>('AuditLog', auditLogSchema);

export default AuditLogModel;
