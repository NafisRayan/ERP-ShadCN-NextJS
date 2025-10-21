import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/authorization';
import {
  getRoleById,
  updateRole,
  deleteRole,
} from '@/lib/services/roleService';
import { updateRoleSchema } from '@/lib/validations/role';

/**
 * GET /api/roles/[roleId] - Get a specific role
 */
async function getRoleHandler(
  request: NextRequest,
  context: { userId: string; organizationId: string; params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId } = await context.params;

    const role = await getRoleById(roleId, context.organizationId);

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Role not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    console.error('Get role error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch role',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/roles/[roleId] - Update a role
 */
async function updateRoleHandler(
  request: NextRequest,
  context: { userId: string; organizationId: string; params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId } = await context.params;
    const body = await request.json();

    // Validate input
    const validatedData = updateRoleSchema.parse(body);

    // Update role
    const role = await updateRole(roleId, context.organizationId, validatedData);

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Role not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: role,
      message: 'Role updated successfully',
    });
  } catch (error: any) {
    console.error('Update role error:', error);

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

    if (error.message.includes('System roles cannot be modified')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update role',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roles/[roleId] - Delete a role
 */
async function deleteRoleHandler(
  request: NextRequest,
  context: { userId: string; organizationId: string; params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId} = await context.params;

    await deleteRole(roleId, context.organizationId);

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete role error:', error);

    if (error.message.includes('System roles cannot be deleted')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 403 }
      );
    }

    if (error.message.includes('Cannot delete role')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete role',
      },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getRoleHandler);
export const PATCH = withAdmin(updateRoleHandler);
export const DELETE = withAdmin(deleteRoleHandler);
