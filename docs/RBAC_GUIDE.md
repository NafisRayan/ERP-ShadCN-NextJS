# Role-Based Access Control (RBAC) Guide

## Overview

The ERP system implements a comprehensive Role-Based Access Control (RBAC) system that provides:

- **Granular Permissions**: Control access at the resource and action level
- **Custom Roles**: Create organization-specific roles with custom permissions
- **System Roles**: Pre-defined roles (admin, manager, employee, user) with default permissions
- **Organization Isolation**: All data is automatically scoped to the user's organization
- **API Protection**: Middleware to protect API routes with permission checks

## Architecture

### Components

1. **Role Model** (`lib/db/models/Role.ts`)
   - Stores custom roles with permissions
   - Supports system roles that cannot be deleted
   - Organization-scoped

2. **Permission Utilities** (`lib/utils/permissions.ts`)
   - Functions to check permissions
   - Default permissions for system roles
   - Permission merging logic

3. **Authorization Middleware** (`lib/middleware/authorization.ts`)
   - Protects API routes
   - Validates user permissions
   - Provides helper wrappers

4. **Role Service** (`lib/services/roleService.ts`)
   - Business logic for role management
   - User permission resolution
   - Role assignment

5. **Data Isolation Utilities** (`lib/utils/dataIsolation.ts`)
   - Ensures organization-based data filtering
   - Scoped query builders
   - Access validation

## System Roles

### Admin
- Full access to all resources and actions
- Can manage users, roles, and organization settings
- Wildcard permission: `*` with all actions

### Manager
- Access to most business operations
- Can manage products, customers, orders, inventory, projects
- Cannot manage users or system settings
- Read-only access to employees and reports

### Employee
- Limited access to daily operations
- Can view products and customers
- Can create and update orders and tasks
- Read-only access to inventory and projects

### User
- Minimal access
- Can view dashboard, products, and orders
- No create, update, or delete permissions

## Permission Structure

Permissions are defined as:

```typescript
{
  resource: string,  // e.g., 'products', 'customers', 'orders'
  actions: string[]  // e.g., ['create', 'read', 'update', 'delete']
}
```

### Available Actions
- `create`: Create new entities
- `read`: View entities
- `update`: Modify existing entities
- `delete`: Remove entities
- `export`: Export data
- `import`: Import data

### Available Resources
- `dashboard`: Main dashboard
- `products`: Product catalog
- `customers`: Customer management
- `orders`: Sales orders
- `suppliers`: Supplier management
- `purchases`: Purchase orders
- `inventory`: Inventory tracking
- `projects`: Project management
- `tasks`: Task management
- `employees`: Employee records
- `reports`: Reporting system
- `documents`: Document management
- `finance`: Financial management
- `settings`: System settings
- `users`: User management
- `roles`: Role management

## Usage

### Protecting API Routes

#### Method 1: Using `withPermission` wrapper

```typescript
import { withPermission } from '@/lib/middleware/authorization';

async function handler(
  request: NextRequest,
  context: { userId: string; organizationId: string }
) {
  // Your handler logic
  // Data is automatically scoped to context.organizationId
}

export const GET = withPermission(handler, {
  resource: 'products',
  action: 'read',
});
```

#### Method 2: Using `withAdmin` wrapper

```typescript
import { withAdmin } from '@/lib/middleware/authorization';

async function handler(
  request: NextRequest,
  context: { userId: string; organizationId: string }
) {
  // Only admins can access this
}

export const GET = withAdmin(handler);
```

#### Method 3: Manual permission check

```typescript
import { requirePermission } from '@/lib/middleware/authorization';

export async function GET(request: NextRequest) {
  const authResult = await requirePermission(request, {
    resource: 'products',
    action: 'read',
  });

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 403 });
  }

  // Your logic here
}
```

### Checking Permissions in Client Components

```typescript
'use client';

import { usePermissions } from '@/lib/hooks/usePermissions';

export function MyComponent() {
  const { checkPermission, isAdmin, loading } = usePermissions();

  if (loading) return <div>Loading...</div>;

  const canCreateProducts = checkPermission('products', 'create');
  const canDeleteOrders = checkPermission('orders', 'delete');

  return (
    <div>
      {canCreateProducts && <button>Create Product</button>}
      {canDeleteOrders && <button>Delete Order</button>}
      {isAdmin && <button>Admin Settings</button>}
    </div>
  );
}
```

### Organization-Based Data Isolation

#### Using Scoped Queries

```typescript
import { createScopedQuery } from '@/lib/utils/dataIsolation';
import Product from '@/lib/db/models/Product';

async function handler(
  request: NextRequest,
  context: { userId: string; organizationId: string }
) {
  // Create a scoped query builder
  const scopedQuery = createScopedQuery(Product, context.organizationId);

  // All queries are automatically filtered by organization
  const products = await scopedQuery.find({ isActive: true });
  const product = await scopedQuery.findById(productId);
  
  return NextResponse.json({ data: products });
}
```

#### Manual Organization Filtering

```typescript
import { addOrganizationFilter } from '@/lib/utils/dataIsolation';

const filter = addOrganizationFilter(
  { isActive: true },
  context.organizationId
);

const products = await Product.find(filter);
```

#### Validating Entity Access

```typescript
import { ensureOrganizationAccess } from '@/lib/utils/dataIsolation';

// Ensure entity belongs to user's organization
await ensureOrganizationAccess(
  Product,
  productId,
  context.organizationId
);
```

## Managing Roles

### Creating a Custom Role

1. Navigate to Settings > Roles
2. Click "Create Role"
3. Enter role name and description
4. Add permissions by selecting resources and actions
5. Click "Create Role"

### Assigning Roles to Users

```typescript
import { assignRoleToUser } from '@/lib/services/roleService';

await assignRoleToUser(userId, roleId, organizationId);
```

### Getting User Permissions

```typescript
import { getUserPermissions } from '@/lib/services/roleService';

const permissions = await getUserPermissions(userId, organizationId);
```

## API Endpoints

### Role Management

- `GET /api/roles` - List all roles (Admin only)
- `POST /api/roles` - Create a new role (Admin only)
- `GET /api/roles/[roleId]` - Get role details (Admin only)
- `PATCH /api/roles/[roleId]` - Update a role (Admin only)
- `DELETE /api/roles/[roleId]` - Delete a role (Admin only)
- `POST /api/roles/assign` - Assign role to user (Admin only)
- `DELETE /api/roles/assign?userId=xxx` - Remove custom role from user (Admin only)

### User Permissions

- `GET /api/users/me/permissions` - Get current user's permissions

## Best Practices

1. **Always use middleware**: Protect all API routes with authorization middleware
2. **Scope queries**: Use scoped queries or manual filtering to ensure organization isolation
3. **Validate access**: When accepting entity IDs in requests, validate they belong to the user's organization
4. **Principle of least privilege**: Assign minimal permissions needed for each role
5. **Custom roles**: Create custom roles for specific job functions rather than modifying system roles
6. **Audit trail**: All permission checks and role changes should be logged (implement audit logging)

## Security Considerations

1. **Organization Isolation**: All database queries MUST include organization filter
2. **Permission Checks**: Never trust client-side permission checks alone
3. **System Roles**: System roles cannot be modified or deleted
4. **Role Assignment**: Only admins can assign roles
5. **Session Validation**: All API routes must validate the session
6. **Error Messages**: Don't expose sensitive information in error messages

## Troubleshooting

### User can't access a resource

1. Check user's system role in the database
2. Check if user has a custom role assigned
3. Verify the custom role has the required permissions
4. Check if the role is active
5. Verify the API route has correct permission requirements

### Permission check fails

1. Ensure the session is valid
2. Check if the user belongs to the organization
3. Verify the permission resource and action names match exactly
4. Check if the role has the required permissions

### Data isolation issues

1. Verify all queries include organizationId filter
2. Check if the entity belongs to the user's organization
3. Ensure the middleware is properly extracting organizationId from session
4. Validate that the organization context is passed to all service functions

## Future Enhancements

- [ ] Field-level permissions
- [ ] Time-based permissions (temporary access)
- [ ] Permission inheritance and hierarchies
- [ ] Permission templates
- [ ] Bulk role assignment
- [ ] Permission audit logs
- [ ] Role usage analytics
- [ ] Permission testing tools
