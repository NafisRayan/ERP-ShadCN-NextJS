'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { DollarSign, TrendingUp, ShoppingCart, Users } from 'lucide-react';
import useSWR from 'swr';

interface DashboardMetrics {
  revenue: {
    total: number;
    change: number;
  };
  expenses: {
    total: number;
    change: number;
  };
  sales: {
    total: number;
    change: number;
  };
  customers: {
    total: number;
    change: number;
  };
}

interface DashboardMetricsProps {
  initialData: DashboardMetrics;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DashboardMetrics({ initialData }: DashboardMetricsProps) {
  const { data: metrics } = useSWR<DashboardMetrics>(
    '/api/dashboard/metrics',
    fetcher,
    {
      fallbackData: initialData,
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  if (!metrics) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={metrics.revenue.total}
        change={metrics.revenue.change}
        icon={DollarSign}
        iconColor="text-green-600"
        format="currency"
      />
      <StatsCard
        title="Total Expenses"
        value={metrics.expenses.total}
        change={metrics.expenses.change}
        icon={TrendingUp}
        iconColor="text-red-600"
        format="currency"
      />
      <StatsCard
        title="Sales Orders"
        value={metrics.sales.total}
        change={metrics.sales.change}
        icon={ShoppingCart}
        iconColor="text-blue-600"
        format="number"
      />
      <StatsCard
        title="New Customers"
        value={metrics.customers.total}
        change={metrics.customers.change}
        icon={Users}
        iconColor="text-purple-600"
        format="number"
      />
    </div>
  );
}
