'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IPermission } from '@/lib/db/models/Role';

const AVAILABLE_RESOURCES = [
  'dashboard',
  'products',
  'customers',
  'orders',
  'suppliers',
  'purchases',
  'inventory',
  'projects',
  'tasks',
  'employees',
  'reports',
  'documents',
  'finance',
  'settings',
  'users',
  'roles',
];

const AVAILABLE_ACTIONS = ['create', 'read', 'update', 'delete', 'export', 'import'];

export default function NewRolePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPermission = () => {
    setPermissions([...permissions, { resource: '', actions: [] }]);
  };

  const removePermission = (index: number) => {
    setPermissions(permissions.filter((_, i) => i !== index));
  };

  const updatePermissionResource = (index: number, resource: string) => {
    const updated = [...permissions];
    updated[index].resource = resource;
    setPermissions(updated);
  };

  const togglePermissionAction = (index: number, action: string) => {
    const updated = [...permissions];
    const actions = updated[index].actions;
    
    if (actions.includes(action)) {
      updated[index].actions = actions.filter((a) => a !== action);
    } else {
      updated[index].actions = [...actions, action];
    }
    
    setPermissions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!name.trim()) {
      setError('Role name is required');
      return;
    }

    if (permissions.length === 0) {
      setError('At least one permission is required');
      return;
    }

    for (const perm of permissions) {
      if (!perm.resource) {
        setError('All permissions must have a resource');
        return;
      }
      if (perm.actions.length === 0) {
        setError('All permissions must have at least one action');
        return;
      }
    }

    try {
      setLoading(true);
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          permissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard/settings/roles');
      } else {
        setError(data.error || 'Failed to create role');
      }
    } catch (err) {
      setError('Failed to create role');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Role</h1>
        <p className="text-gray-600 mt-1">
          Define a custom role with specific permissions
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sales Manager"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role's purpose"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Permissions</h2>
            <Button type="button" onClick={addPermission} variant="outline">
              Add Permission
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {permissions.map((permission, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <Label>Permission {index + 1}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removePermission(index)}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>

                <div className="mb-3">
                  <Label htmlFor={`resource-${index}`}>Resource *</Label>
                  <select
                    id={`resource-${index}`}
                    value={permission.resource}
                    onChange={(e) =>
                      updatePermissionResource(index, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a resource</option>
                    {AVAILABLE_RESOURCES.map((resource) => (
                      <option key={resource} value={resource}>
                        {resource}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Actions *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AVAILABLE_ACTIONS.map((action) => (
                      <label
                        key={action}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={permission.actions.includes(action)}
                          onChange={() => togglePermissionAction(index, action)}
                        />
                        <span className="text-sm">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {permissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No permissions added yet. Click "Add Permission" to get started.
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Role'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/settings/roles')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
