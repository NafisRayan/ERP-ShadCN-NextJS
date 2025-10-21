import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserPermissions } from '@/lib/services/roleService';
import { hasPermission, hasAnyPermission } from '@/lib/utils/permissions';

/**
 * Authorization middleware for API routes
 */

export interface AuthorizationOptions {
  resource: string;
  action: string;
  requireAll?: boolean; // If true, user must have all specified permissions
}

export interface MultiAuthorizationOptions {
  checks: Array<{ resource: string; action: string }>;
  requireAll?: boolean; // If true, user must have all permissions; if false, any permission is sufficient
}

/**
 * Middleware to check if user has required permission
 */
export async function requirePermission(
  request: NextRequest,
  options: AuthorizationOptions
): Promise<{ authorized: boolean; error?: string; userId?: string; organizationId?: string }> {
  try {
    // Get session
    const session = await auth();

    if (!session || !session.user) {
      return {
        authorized: false,
        error: 'Authentication required',
      };
    }

    const { id: userId, organizationId } = session.user;

    // Get user permissions
    const permissions = await getUserPermissions(userId, organizationId);

    // Check permission
    const hasAccess = hasPermission(permissions, options.resource, options.action);

    if (!hasAccess) {
      return {
        authorized: false,
        error: `Insufficient permissions. Required: ${options.action} on ${options.resource}`,
      };
    }

    return {
      authorized: true,
      userId,
      organizationId,
    };
  } catch (error) {
    console.error('Authorization error:', error);
    return {
      authorized: false,
      error: 'Authorization check failed',
    };
  }
}

/**
 * Middleware to check if user has any of the required permissions
 */
export async function requireAnyPermission(
  request: NextRequest,
  options: MultiAuthorizationOptions
): Promise<{ authorized: boolean; error?: string; userId?: string; organizationId?: string }> {
  try {
    // Get session
    const session = await auth();

    if (!session || !session.user) {
      return {
        authorized: false,
        error: 'Authentication required',
      };
    }

    const { id: userId, organizationId } = session.user;

    // Get user permissions
    const permissions = await getUserPermissions(userId, organizationId);

    // Check permissions
    const hasAccess = options.requireAll
      ? options.checks.every((check) =>
          hasPermission(permissions, check.resource, check.action)
        )
      : hasAnyPermission(permissions, options.checks);

    if (!hasAccess) {
      const requiredPerms = options.checks
        .map((c) => `${c.action} on ${c.resource}`)
        .join(', ');
      return {
        authorized: false,
        error: `Insufficient permissions. Required: ${requiredPerms}`,
      };
    }

    return {
      authorized: true,
      userId,
      organizationId,
    };
  } catch (error) {
    console.error('Authorization error:', error);
    return {
      authorized: false,
      error: 'Authorization check failed',
    };
  }
}

/**
 * Middleware to check if user has admin role
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ authorized: boolean; error?: string; userId?: string; organizationId?: string }> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        authorized: false,
        error: 'Authentication required',
      };
    }

    const { id: userId, organizationId, role } = session.user;

    if (role !== 'admin') {
      return {
        authorized: false,
        error: 'Admin access required',
      };
    }

    return {
      authorized: true,
      userId,
      organizationId,
    };
  } catch (error) {
    console.error('Authorization error:', error);
    return {
      authorized: false,
      error: 'Authorization check failed',
    };
  }
}

/**
 * Helper to create unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  );
}

/**
 * Helper to create unauthenticated response
 */
export function unauthenticatedResponse(message: string = 'Authentication required'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

/**
 * Wrapper function to protect API routes with permission checks
 */
export function withPermission(
  handler: (
    request: NextRequest,
    context: { userId: string; organizationId: string; params?: any }
  ) => Promise<NextResponse>,
  options: AuthorizationOptions
) {
  return async (request: NextRequest, context?: { params?: any }) => {
    const authResult = await requirePermission(request, options);

    if (!authResult.authorized) {
      if (authResult.error?.includes('Authentication required')) {
        return unauthenticatedResponse(authResult.error);
      }
      return unauthorizedResponse(authResult.error);
    }

    return handler(request, {
      userId: authResult.userId!,
      organizationId: authResult.organizationId!,
      params: context?.params,
    });
  };
}

/**
 * Wrapper function to protect API routes with admin check
 */
export function withAdmin(
  handler: (
    request: NextRequest,
    context: { userId: string; organizationId: string; params?: any }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: { params?: any }) => {
    const authResult = await requireAdmin(request);

    if (!authResult.authorized) {
      if (authResult.error?.includes('Authentication required')) {
        return unauthenticatedResponse(authResult.error);
      }
      return unauthorizedResponse(authResult.error);
    }

    return handler(request, {
      userId: authResult.userId!,
      organizationId: authResult.organizationId!,
      params: context?.params,
    });
  };
}
