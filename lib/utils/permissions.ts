import { IPermission } from '@/lib/db/models/Role';

/**
 * Permission checking utilities for RBAC
 */

// Default permissions for system roles
export const DEFAULT_PERMISSIONS: Record<string, IPermission[]> = {
  admin: [
    {
      resource: '*',
      actions: ['create', 'read', 'update', 'delete', 'export', 'import'],
    },
  ],
  manager: [
    {
      resource: 'dashboard',
      actions: ['read'],
    },
    {
      resource: 'products',
      actions: ['create', 'read', 'update', 'delete', 'export', 'import'],
    },
    {
      resource: 'customers',
      actions: ['create', 'read', 'update', 'delete', 'export'],
    },
    {
      resource: 'orders',
      actions: ['create', 'read', 'update', 'delete', 'export'],
    },
    {
      resource: 'suppliers',
      actions: ['create', 'read', 'update', 'delete'],
    },
    {
      resource: 'purchases',
      actions: ['create', 'read', 'update', 'delete'],
    },
    {
      resource: 'inventory',
      actions: ['create', 'read', 'update', 'delete'],
    },
    {
      resource: 'projects',
      actions: ['create', 'read', 'update', 'delete'],
    },
    {
      resource: 'tasks',
      actions: ['create', 'read', 'update', 'delete'],
    },
    {
      resource: 'employees',
      actions: ['read'],
    },
    {
      resource: 'reports',
      actions: ['read', 'export'],
    },
    {
      resource: 'documents',
      actions: ['create', 'read', 'update', 'delete'],
    },
  ],
  employee: [
    {
      resource: 'dashboard',
      actions: ['read'],
    },
    {
      resource: 'products',
      actions: ['read'],
    },
    {
      resource: 'customers',
      actions: ['read'],
    },
    {
      resource: 'orders',
      actions: ['create', 'read', 'update'],
    },
    {
      resource: 'inventory',
      actions: ['read'],
    },
    {
      resource: 'projects',
      actions: ['read', 'update'],
    },
    {
      resource: 'tasks',
      actions: ['create', 'read', 'update'],
    },
    {
      resource: 'documents',
      actions: ['create', 'read'],
    },
  ],
  user: [
    {
      resource: 'dashboard',
      actions: ['read'],
    },
    {
      resource: 'products',
      actions: ['read'],
    },
    {
      resource: 'orders',
      actions: ['read'],
    },
  ],
};

/**
 * Check if a user has permission to perform an action on a resource
 */
export function hasPermission(
  permissions: IPermission[],
  resource: string,
  action: string
): boolean {
  // Check for wildcard permission (admin)
  const wildcardPermission = permissions.find((p) => p.resource === '*');
  if (wildcardPermission && wildcardPermission.actions.includes(action)) {
    return true;
  }

  // Check for specific resource permission
  const resourcePermission = permissions.find((p) => p.resource === resource);
  if (resourcePermission && resourcePermission.actions.includes(action)) {
    return true;
  }

  return false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  permissions: IPermission[],
  checks: Array<{ resource: string; action: string }>
): boolean {
  return checks.some((check) =>
    hasPermission(permissions, check.resource, check.action)
  );
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  permissions: IPermission[],
  checks: Array<{ resource: string; action: string }>
): boolean {
  return checks.every((check) =>
    hasPermission(permissions, check.resource, check.action)
  );
}

/**
 * Get permissions for a system role
 */
export function getSystemRolePermissions(role: string): IPermission[] {
  return DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.user;
}

/**
 * Merge custom role permissions with system role permissions
 * Custom permissions take precedence
 */
export function mergePermissions(
  systemRole: string,
  customPermissions?: IPermission[]
): IPermission[] {
  if (!customPermissions || customPermissions.length === 0) {
    return getSystemRolePermissions(systemRole);
  }

  // If custom permissions exist, use them exclusively
  return customPermissions;
}

/**
 * Filter resources based on permissions
 */
export function getAccessibleResources(
  permissions: IPermission[],
  action: string
): string[] {
  const resources: string[] = [];

  // Check for wildcard permission
  const wildcardPermission = permissions.find((p) => p.resource === '*');
  if (wildcardPermission && wildcardPermission.actions.includes(action)) {
    return ['*']; // User has access to all resources
  }

  // Collect specific resources
  permissions.forEach((permission) => {
    if (permission.actions.includes(action)) {
      resources.push(permission.resource);
    }
  });

  return resources;
}

/**
 * Check if user can access a specific module
 */
export function canAccessModule(
  permissions: IPermission[],
  module: string
): boolean {
  return hasPermission(permissions, module, 'read');
}
