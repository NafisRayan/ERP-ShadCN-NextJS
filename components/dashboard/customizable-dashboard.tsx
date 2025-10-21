'use client';

import { useEffect, useState } from 'react';
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { SalesOverview } from '@/components/dashboard/sales-overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DollarSign, TrendingUp, ShoppingCart, Users } from 'lucide-react';

interface WidgetConfig {
  type: string;
  position: number;
  isVisible: boolean;
  size?: 'small' | 'medium' | 'large';
}

interface DashboardData {
  metrics: any;
  revenueData: any[];
  salesData: any[];
  activities: any[];
}

interface CustomizableDashboardProps {
  data: DashboardData;
  userRole: string;
}

export function CustomizableDashboard({ data, userRole }: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWidgetConfig();
  }, []);

  const fetchWidgetConfig = async () => {
    try {
      const response = await fetch('/api/dashboard/widgets');
      if (response.ok) {
        const result = await response.json();
        setWidgets(result.widgets || getDefaultWidgets());
      } else {
        setWidgets(getDefaultWidgets());
      }
    } catch (error) {
      console.error('Error fetching widget config:', error);
      setWidgets(getDefaultWidgets());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultWidgets = (): WidgetConfig[] => [
    { type: 'revenue', position: 0, isVisible: true, size: 'small' },
    { type: 'expenses', position: 1, isVisible: true, size: 'small' },
    { type: 'sales', position: 2, isVisible: true, size: 'small' },
    { type: 'customers', position: 3, isVisible: true, size: 'small' },
    { type: 'revenue-chart', position: 4, isVisible: true, size: 'large' },
    { type: 'sales-overview', position: 5, isVisible: true, size: 'medium' },
    { type: 'recent-activity', position: 6, isVisible: true, size: 'large' },
  ];

  const renderWidget = (widget: WidgetConfig) => {
    if (!widget.isVisible) return null;

    switch (widget.type) {
      case 'revenue':
        return (
          <StatsCard
            key="revenue"
            title="Total Revenue"
            value={data.metrics.revenue.total}
            change={data.metrics.revenue.change}
            icon={DollarSign}
            iconColor="text-green-600"
            format="currency"
          />
        );
      case 'expenses':
        return (
          <StatsCard
            key="expenses"
            title="Total Expenses"
            value={data.metrics.expenses.total}
            change={data.metrics.expenses.change}
            icon={TrendingUp}
            iconColor="text-red-600"
            format="currency"
          />
        );
      case 'sales':
        return (
          <StatsCard
            key="sales"
            title="Sales Orders"
            value={data.metrics.sales.total}
            change={data.metrics.sales.change}
            icon={ShoppingCart}
            iconColor="text-blue-600"
            format="number"
          />
        );
      case 'customers':
        return (
          <StatsCard
            key="customers"
            title="New Customers"
            value={data.metrics.customers.total}
            change={data.metrics.customers.change}
            icon={Users}
            iconColor="text-purple-600"
            format="number"
          />
        );
      case 'revenue-chart':
        return <RevenueChart key="revenue-chart" data={data.revenueData} />;
      case 'sales-overview':
        return <SalesOverview key="sales-overview" data={data.salesData} />;
      case 'recent-activity':
        return <RecentActivity key="recent-activity" activities={data.activities} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <DashboardMetrics initialData={data.metrics} />;
  }

  const sortedWidgets = [...widgets].sort((a, b) => a.position - b.position);
  const kpiWidgets = sortedWidgets.filter((w) =>
    ['revenue', 'expenses', 'sales', 'customers'].includes(w.type)
  );
  const chartWidgets = sortedWidgets.filter((w) =>
    ['revenue-chart', 'sales-overview'].includes(w.type)
  );
  const activityWidgets = sortedWidgets.filter((w) => w.type === 'recent-activity');

  return (
    <>
      {/* KPI Cards */}
      {kpiWidgets.some((w) => w.isVisible) && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpiWidgets.map((widget) => renderWidget(widget))}
        </div>
      )}

      {/* Charts */}
      {chartWidgets.some((w) => w.isVisible) && (
        <div className="grid gap-6 lg:grid-cols-3">
          {chartWidgets.map((widget) => renderWidget(widget))}
        </div>
      )}

      {/* Recent Activity */}
      {activityWidgets.map((widget) => renderWidget(widget))}
    </>
  );
}
