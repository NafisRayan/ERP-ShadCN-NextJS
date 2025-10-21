import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/authorization';
import {
  createRole,
  getRolesByOrganization,
} from '@/lib/services/roleService';
import { createRoleSchema } from '@/lib/validations/role';

/**
 * GET /api/roles - Get all roles for the organization
 */
async function getRolesHandler(
  request: NextRequest,
  context: { userId: string; organizationId: string }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSystem = searchParams.get('includeSystem') !== 'false';

    const roles = await getRolesByOrganization(
      context.organizationId,
      includeSystem
    );

    return NextResponse.json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error('Get roles error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch roles',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/roles - Create a new role
 */
async function createRoleHandler(
  request: NextRequest,
  context: { userId: string; organizationId: string }
) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createRoleSchema.parse(body);

    // Create role
    const role = await createRole({
      organizationId: context.organizationId,
      name: validatedData.name,
      description: validatedData.description,
      permissions: validatedData.permissions,
    });

    return NextResponse.json(
      {
        success: true,
        data: role,
        message: 'Role created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create role error:', error);

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

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'A role with this name already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create role',
      },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getRolesHandler);
export const POST = withAdmin(createRoleHandler);
