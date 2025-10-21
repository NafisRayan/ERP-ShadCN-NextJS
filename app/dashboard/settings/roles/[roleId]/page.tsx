import { requireServerAdmin } from '@/lib/utils/serverPermissions';
import { getRoleById } from '@/lib/services/roleService';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';

interface RoleDetailPageProps {
  params: Promise<{
    roleId: string;
  }>;
}

export default async function RoleDetailPage({ params }: RoleDetailPageProps) {
  // Require admin access
  const { organizationId } = await requireServerAdmin();

  // Fetch role
  const { roleId } = await params;
  const role = await getRoleById(roleId, organizationId);

  if (!role) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{role.name}</h1>
        {role.description && (
          <p className="text-gray-600 mt-1">{role.description}</p>
        )}
        <div className="flex gap-2 mt-3">
          {role.isSystem && (
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              System Role
            </span>
          )}
          {!role.isActive && (
            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
              Inactive
            </span>
          )}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Permissions</h2>
        
        {role.permissions.length === 0 ? (
          <p className="text-gray-500">No permissions defined</p>
        ) : (
          <div className="space-y-4">
            {role.permissions.map((permission, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg capitalize">
                    {permission.resource}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {permission.actions.map((action) => (
                    <span
                      key={action}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Created: {new Date(role.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          Last Updated: {new Date(role.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
