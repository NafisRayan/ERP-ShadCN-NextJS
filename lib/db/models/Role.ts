import mongoose, { Schema, Document, Model } from 'mongoose';

// Permission structure for granular access control
export interface IPermission {
  resource: string; // e.g., 'products', 'customers', 'orders', 'users', 'reports'
  actions: string[]; // e.g., ['create', 'read', 'update', 'delete']
}

export interface IRole extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  permissions: IPermission[];
  isSystem: boolean; // System roles cannot be deleted (admin, manager, employee, user)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    resource: {
      type: String,
      required: true,
      trim: true,
    },
    actions: {
      type: [String],
      required: true,
      validate: {
        validator: function (actions: string[]) {
          const validActions = ['create', 'read', 'update', 'delete', 'export', 'import'];
          return actions.every((action) => validActions.includes(action));
        },
        message: 'Invalid action in permissions',
      },
    },
  },
  { _id: false }
);

const RoleSchema = new Schema<IRole>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: {
      type: [PermissionSchema],
      default: [],
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RoleSchema.index({ organizationId: 1 });
RoleSchema.index({ organizationId: 1, name: 1 }, { unique: true });
RoleSchema.index({ isSystem: 1 });

// Prevent deletion of system roles
RoleSchema.pre('deleteOne', { document: true, query: false }, function (next) {
  if (this.isSystem) {
    next(new Error('System roles cannot be deleted'));
  } else {
    next();
  }
});

const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

export default Role;
