import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {session?.user.name}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              User Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Name:</span> {session?.user.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {session?.user.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Role:</span> {session?.user.role}
            </p>
            <p className="text-sm">
              <span className="font-medium">Organization ID:</span>{' '}
              {session?.user.organizationId}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">✓ System Online</p>
            <p className="text-sm text-muted-foreground">
              All services operational
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
