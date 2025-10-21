import { NextRequest, NextResponse } from 'next/server';
import { withPermission } from '@/lib/middleware/authorization';
import { createScopedQuery } from '@/lib/utils/dataIsolation';
import connectDB from '@/lib/db/mongodb';

/**
 * Example protected API route demonstrating:
 * 1. Permission-based authorization
 * 2. Organization-based data isolation
 * 
 * This route requires 'read' permission on 'products' resource
 */
async function getProtectedDataHandler(
  request: NextRequest,
  context: { userId: string; organizationId: string }
) {
  try {
    await connectDB();

    // Example: Using scoped query to automatically filter by organization
    // const Product = (await import('@/lib/db/models/Product')).default;
    // const scopedQuery = createScopedQuery(Product, context.organizationId);
    // const products = await scopedQuery.find({ isActive: true }).limit(10);

    // For demonstration purposes, return context info
    return NextResponse.json({
      success: true,
      message: 'Access granted',
      data: {
        userId: context.userId,
        organizationId: context.organizationId,
        info: 'This data is automatically filtered by your organization',
      },
    });
  } catch (error: any) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch data',
      },
      { status: 500 }
    );
  }
}

// Protect the route with permission check
export const GET = withPermission(getProtectedDataHandler, {
  resource: 'products',
  action: 'read',
});
