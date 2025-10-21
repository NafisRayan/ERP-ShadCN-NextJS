'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { IPermission } from '@/lib/db/models/Role';
import { hasPermission, hasAnyPermission, canAccessModule } from '@/lib/utils/permissions';

/**
 * Hook to check user permissions on the client side
 */
export function usePermissions() {
  const { data: session, status } = useSession();
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/users/me/permissions');
          if (response.ok) {
            const data = await response.json();
            setPermissions(data.data || []);
          }
        } catch (error) {
          console.error('Failed to fetch permissions:', error);
        } finally {
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, [session, status]);

  const checkPermission = (resource: string, action: string): boolean => {
    return hasPermission(permissions, resource, action);
  };

  const checkAnyPermission = (
    checks: Array<{ resource: string; action: string }>
  ): boolean => {
    return hasAnyPermission(permissions, checks);
  };

  const checkModuleAccess = (module: string): boolean => {
    return canAccessModule(permissions, module);
  };

  const isAdmin = session?.user?.role === 'admin';

  return {
    permissions,
    loading,
    isAuthenticated: status === 'authenticated',
    isAdmin,
    checkPermission,
    checkAnyPermission,
    checkModuleAccess,
  };
}
