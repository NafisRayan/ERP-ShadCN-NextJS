import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {session.user.name}!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">User Info</h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Name:</span> {session.user.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {session.user.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Role:</span> {session.user.role}
              </p>
              <p className="text-sm">
                <span className="font-medium">Organization ID:</span>{' '}
                {session.user.organizationId}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Quick Stats</h3>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-4">
              <p className="text-sm text-green-600">✓ System Online</p>
              <p className="text-sm text-gray-600">All services operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
