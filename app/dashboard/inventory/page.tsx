import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Warehouse, TrendingDown, BarChart3 } from 'lucide-react';

const inventoryModules = [
  {
    title: 'Products',
    description: 'Manage your product catalog',
    href: '/dashboard/inventory/products',
    icon: Package,
  },
  {
    title: 'Warehouses',
    description: 'Manage warehouse locations',
    href: '/dashboard/inventory/warehouses',
    icon: Warehouse,
    comingSoon: true,
  },
  {
    title: 'Low Stock Alerts',
    description: 'View products with low stock levels',
    href: '/dashboard/inventory/low-stock',
    icon: TrendingDown,
    comingSoon: true,
  },
  {
    title: 'Inventory Reports',
    description: 'View inventory analytics and reports',
    href: '/dashboard/inventory/reports',
    icon: BarChart3,
    comingSoon: true,
  },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage products, warehouses, and stock levels
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {inventoryModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.href}
              href={module.comingSoon ? '#' : module.href}
              className={module.comingSoon ? 'pointer-events-none' : ''}
            >
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    {module.comingSoon && (
                      <span className="text-xs text-muted-foreground">Coming Soon</span>
                    )}
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
