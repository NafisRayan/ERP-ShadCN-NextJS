import { auth } from '@/lib/auth';
import { DashboardService } from '@/lib/services/dashboard.service';
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { SalesOverview } from '@/components/dashboard/sales-overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function DashboardContent({ organizationId }: { organizationId: string }) {
  try {
    const [metrics, revenueData, salesData, activities] = await Promise.all([
      DashboardService.getMetrics(organizationId),
      DashboardService.getRevenueData(organizationId),
      DashboardService.getSalesOverview(organizationId),
      DashboardService.getRecentActivity(organizationId, 10),
    ]);

    return (
      <>
        {/* KPI Cards with real-time updates */}
        <DashboardMetrics initialData={metrics} />

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <RevenueChart data={revenueData} />
          <SalesOverview data={salesData} />
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </>
    );
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load dashboard data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user.organizationId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {session?.user.name}!
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              No organization found. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {session.user.name}!
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent organizationId={session.user.organizationId} />
      </Suspense>
    </div>
  );
}
