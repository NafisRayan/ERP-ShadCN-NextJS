import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserPermissions } from '@/lib/services/roleService';

/**
 * GET /api/users/me/permissions - Get current user's permissions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      );
    }

    const { id: userId, organizationId } = session.user;

    const permissions = await getUserPermissions(userId, organizationId);

    return NextResponse.json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    console.error('Get permissions error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch permissions',
      },
      { status: 500 }
    );
  }
}
