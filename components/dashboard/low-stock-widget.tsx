'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface LowStockStats {
  total: number;
  critical: number;
  low: number;
}

export function LowStockWidget() {
  const [stats, setStats] = useState<LowStockStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/inventory/low-stock/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          total: data.total,
          critical: data.critical,
          low: data.low,
        });
      }
    } catch (error) {
      console.error('Error fetching low stock stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All products are adequately stocked
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Critical (Out of Stock)</span>
            <Badge variant="destructive">{stats.critical}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Low Stock</span>
            <Badge variant="secondary">{stats.low}</Badge>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm font-medium">Total Alerts</span>
            <Badge>{stats.total}</Badge>
          </div>
          <Link
            href="/dashboard/inventory/low-stock"
            className="block text-center text-sm text-primary hover:underline mt-4"
          >
            View All Low Stock Products →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
