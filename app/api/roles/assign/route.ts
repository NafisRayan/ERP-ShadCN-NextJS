import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/authorization';
import {
  assignRoleToUser,
  removeRoleFromUser,
} from '@/lib/services/roleService';
import { assignRoleSchema } from '@/lib/validations/role';
import { z } from 'zod';

/**
 * POST /api/roles/assign - Assign a custom role to a user
 */
async function assignRoleHandler(
  request: NextRequest,
  context: { userId: string; organizationId: string }
) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = assignRoleSchema.parse(body);

    // Assign role
    await assignRoleToUser(
      validatedData.userId,
      validatedData.roleId,
      context.organizationId
    );

    return NextResponse.json({
      success: true,
      message: 'Role assigned successfully',
    });
  } catch (error: any) {
    console.error('Assign role error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to assign role',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roles/assign - Remove custom role from a user
 */
async function removeRoleHandler(
  request: NextRequest,
  context: { userId: string; organizationId: string }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
        },
        { status: 400 }
      );
    }

    // Remove role
    await removeRoleFromUser(userId, context.organizationId);

    return NextResponse.json({
      success: true,
      message: 'Custom role removed successfully',
    });
  } catch (error: any) {
    console.error('Remove role error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove role',
      },
      { status: 500 }
    );
  }
}

export const POST = withAdmin(assignRoleHandler);
export const DELETE = withAdmin(removeRoleHandler);
