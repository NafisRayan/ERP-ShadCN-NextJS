'use client';

import { usePermissions } from '@/lib/hooks/usePermissions';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  resource: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 */
export function PermissionGuard({
  resource,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { checkPermission, loading } = usePermissions();

  if (loading) {
    return <>{fallback}</>;
  }

  const hasAccess = checkPermission(resource, action);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render content for admin users only
 */
export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  const { isAdmin, loading } = usePermissions();

  if (loading) {
    return <>{fallback}</>;
  }

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ModuleGuardProps {
  module: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render content based on module access
 */
export function ModuleGuard({
  module,
  children,
  fallback = null,
}: ModuleGuardProps) {
  const { checkModuleAccess, loading } = usePermissions();

  if (loading) {
    return <>{fallback}</>;
  }

  const hasAccess = checkModuleAccess(module);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
