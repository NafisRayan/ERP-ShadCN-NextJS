'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IRole } from '@/lib/db/models/Role';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { useRouter } from 'next/navigation';

export default function RolesPage() {
  const router = useRouter();
  const { isAdmin, loading: permissionsLoading } = usePermissions();
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!permissionsLoading && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    if (isAdmin) {
      fetchRoles();
    }
  }, [isAdmin, permissionsLoading, router]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles');
      const data = await response.json();

      if (data.success) {
        setRoles(data.data);
      } else {
        setError(data.error || 'Failed to fetch roles');
      }
    } catch (err) {
      setError('Failed to fetch roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setRoles(roles.filter((role) => String(role._id) !== roleId));
      } else {
        alert(data.error || 'Failed to delete role');
      }
    } catch (err) {
      alert('Failed to delete role');
      console.error(err);
    }
  };

  if (permissionsLoading || loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-gray-600 mt-1">
            Manage roles and permissions for your organization
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/settings/roles/new')}>
          Create Role
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={String(role._id)} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{role.name}</h3>
                  {role.isSystem && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      System Role
                    </span>
                  )}
                  {!role.isActive && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                {role.description && (
                  <p className="text-gray-600 mt-2">{role.description}</p>
                )}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Permissions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        {perm.resource}: {perm.actions.join(', ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {!role.isSystem && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/settings/roles/${String(role._id)}/edit`
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleDelete(String(role._id), role.name)
                      }
                    >
                      Delete
                    </Button>
                  </>
                )}
                {role.isSystem && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/dashboard/settings/roles/${String(role._id)}`
                      )
                    }
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {roles.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No roles found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
