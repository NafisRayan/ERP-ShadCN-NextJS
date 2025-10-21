# Database Configuration

This directory contains MongoDB database configuration and models for the ERP system.

## Setup Instructions

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (M0 free tier for development, M10+ for production)
3. Configure network access:
   - Add your IP address or allow access from anywhere (0.0.0.0/0) for development
4. Create a database user:
   - Go to Database Access
   - Add a new database user with read/write permissions
   - Save the username and password
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with your database name (e.g., `erp_dev`)

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Example:
```env
MONGODB_URI=mongodb+srv://erp_user:mySecurePassword123@cluster0.abc123.mongodb.net/erp_dev?retryWrites=true&w=majority
```

### 3. Connection Configuration

The database connection is configured in `lib/db/mongodb.ts` with the following features:

- **Connection Pooling**: Min 2, Max 10 connections
- **Automatic Reconnection**: Handles connection drops gracefully
- **Error Handling**: Comprehensive error logging
- **Singleton Pattern**: Reuses connection across requests (Next.js optimization)

### 4. Usage in API Routes

```typescript
import connectDB from '@/lib/db/mongodb';
import ProductModel from '@/lib/db/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find({});
    return Response.json({ success: true, data: products });
  } catch (error) {
    return Response.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
```

### 5. Usage in Server Components

```typescript
import connectDB from '@/lib/db/mongodb';
import ProductModel from '@/lib/db/models/Product';

export default async function ProductsPage() {
  await connectDB();
  const products = await ProductModel.find({}).lean();
  
  return (
    <div>
      {products.map(product => (
        <div key={product._id.toString()}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Base Types

### Common Interfaces

Located in `types/common.ts`:

- **Address**: Standard address format used across entities
- **EmergencyContact**: Emergency contact information for employees
- **AuditLog**: Audit trail for all system changes
- **BaseEntity**: Base interface with organization isolation
- **PaginationParams**: Standard pagination parameters
- **PaginatedResponse**: Paginated API response wrapper
- **ApiResponse**: Standard API response format

### Database Helpers

Located in `lib/utils/db-helpers.ts`:

- `isValidObjectId()`: Validate MongoDB ObjectId
- `toObjectId()`: Convert string to ObjectId safely
- `buildPaginationQuery()`: Build pagination parameters
- `buildPaginatedResponse()`: Create paginated response
- `sanitizeDocument()`: Clean MongoDB documents for API responses
- `buildOrgFilter()`: Create organization filter for multi-tenant queries

### Audit Logging

Located in `lib/utils/audit.ts`:

- `createAuditLog()`: Create audit log entries
- `getEntityAuditLogs()`: Retrieve audit logs for an entity
- `calculateChanges()`: Calculate field-level changes

## Connection Pooling

The connection pool is configured with:

- **maxPoolSize**: 10 connections (suitable for serverless)
- **minPoolSize**: 2 connections (maintains minimum active connections)
- **socketTimeoutMS**: 45000ms (45 seconds)
- **serverSelectionTimeoutMS**: 10000ms (10 seconds)

## Indexes

All models should include appropriate indexes for:

- `organizationId`: Required for multi-tenant data isolation
- Frequently queried fields (e.g., email, sku, orderNumber)
- Compound indexes for common query patterns
- TTL indexes for automatic data expiration (e.g., audit logs)

## Best Practices

1. **Always call `connectDB()`** before database operations
2. **Use `.lean()`** for read-only queries to improve performance
3. **Include organizationId** in all queries for data isolation
4. **Use transactions** for operations that modify multiple collections
5. **Implement proper error handling** for all database operations
6. **Use indexes** for frequently queried fields
7. **Validate data** with Zod schemas before saving to database
8. **Log audit trails** for all create/update/delete operations

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Check your MongoDB Atlas network access settings
2. Verify your connection string in `.env.local`
3. Ensure your IP address is whitelisted
4. Check if your database user has proper permissions

### Performance Issues

1. Add indexes for frequently queried fields
2. Use `.lean()` for read-only queries
3. Implement pagination for large datasets
4. Use aggregation pipelines for complex queries
5. Enable caching for frequently accessed data

### Memory Leaks

1. Ensure you're not creating multiple connections
2. Use the singleton pattern (already implemented)
3. Close connections properly in serverless environments
4. Monitor connection pool usage
