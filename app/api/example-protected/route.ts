import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/middleware/authorization';
import connectDB from '@/lib/db/mongodb';

/**
 * Example protected API route demonstrating:
 * 1. Permission-based authorization
 * 2. Organization-based data isolation
 * 
 * This route requires 'read' permission on 'products' resource
 */
export async function GET(request: NextRequest) {
  try {
    // Check permissions
    const authResult = await requirePermission(request, {
      resource: 'products',
      action: 'read',
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Unauthorized',
        },
        { status: authResult.error?.includes('Authentication') ? 401 : 403 }
      );
    }

    await connectDB();

    // Example: Using scoped query to automatically filter by organization
    // const Product = (await import('@/lib/db/models/Product')).default;
    // const scopedQuery = createScopedQuery(Product, authResult.organizationId!);
    // const products = await scopedQuery.find({ isActive: true }).limit(10);

    // For demonstration purposes, return context info
    return NextResponse.json({
      success: true,
      message: 'Access granted',
      data: {
        userId: authResult.userId,
        organizationId: authResult.organizationId,
        info: 'This data is automatically filtered by your organization',
      },
    });
  } catch (error: unknown) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      },
      { status: 500 }
    );
  }
}
