import { z } from 'zod';

/**
 * Validation schemas for role management
 */

export const permissionSchema = z.object({
  resource: z.string().min(1, 'Resource is required'),
  actions: z
    .array(
      z.enum(['create', 'read', 'update', 'delete', 'export', 'import'], {
        errorMap: () => ({ message: 'Invalid action' }),
      })
    )
    .min(1, 'At least one action is required'),
});

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Role name can only contain letters, numbers, spaces, hyphens, and underscores'),
  description: z.string().max(200, 'Description must not exceed 200 characters').optional(),
  permissions: z.array(permissionSchema).min(1, 'At least one permission is required'),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Role name can only contain letters, numbers, spaces, hyphens, and underscores')
    .optional(),
  description: z.string().max(200, 'Description must not exceed 200 characters').optional(),
  permissions: z.array(permissionSchema).optional(),
  isActive: z.boolean().optional(),
});

export const assignRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  roleId: z.string().min(1, 'Role ID is required'),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
