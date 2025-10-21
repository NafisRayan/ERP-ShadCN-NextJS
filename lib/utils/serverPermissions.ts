import { auth } from '@/lib/auth';
import { getUserPermissions } from '@/lib/services/roleService';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/utils/permissions';
import { redirect } from 'next/navigation';

/**
 * Server-side permission utilities for Server Components and Server Actions
 */

/**
 * Get current user's session and permissions
 */
export async function getCurrentUserPermissions() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const { id: userId, organizationId } = session.user;
  const permissions = await getUserPermissions(userId, organizationId);

  return {
    session,
    permissions,
    userId,
    organizationId,
  };
}

/**
 * Check if current user has permission (for Server Components)
 */
export async function checkServerPermission(
  resource: string,
  action: string
): Promise<boolean> {
  const userPerms = await getCurrentUserPermissions();

  if (!userPerms) {
    return false;
  }

  return hasPermission(userPerms.permissions, resource, action);
}

/**
 * Require permission or redirect (for Server Components)
 */
export async function requireServerPermission(
  resource: string,
  action: string,
  redirectTo: string = '/dashboard'
): Promise<{
  userId: string;
  organizationId: string;
}> {
  const userPerms = await getCurrentUserPermissions();

  if (!userPerms) {
    redirect('/login');
  }

  const hasAccess = hasPermission(userPerms.permissions, resource, action);

  if (!hasAccess) {
    redirect(redirectTo);
  }

  return {
    userId: userPerms.userId,
    organizationId: userPerms.organizationId,
  };
}

/**
 * Require admin role or redirect (for Server Components)
 */
export async function requireServerAdmin(
  redirectTo: string = '/dashboard'
): Promise<{
  userId: string;
  organizationId: string;
}> {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect(redirectTo);
  }

  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
  };
}

/**
 * Check if current user is admin
 */
export async function isServerAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'admin';
}

/**
 * Get current user context (for Server Actions)
 */
export async function getServerUserContext(): Promise<{
  userId: string;
  organizationId: string;
  role: string;
} | null> {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
    role: session.user.role,
  };
}
