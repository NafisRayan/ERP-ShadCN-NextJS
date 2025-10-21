import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Shield, Building, Bell, FileText } from 'lucide-react';

const settingsCategories = [
  {
    title: 'Dashboard',
    description: 'Customize your dashboard layout and widgets',
    href: '/dashboard/settings/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Roles & Permissions',
    description: 'Manage user roles and access control',
    href: '/dashboard/settings/roles',
    icon: Shield,
  },
  {
    title: 'Organization',
    description: 'Configure company information and branding',
    href: '/dashboard/settings/organization',
    icon: Building,
    comingSoon: true,
  },
  {
    title: 'Notifications',
    description: 'Set up notification preferences and alerts',
    href: '/dashboard/settings/notifications',
    icon: Bell,
    comingSoon: true,
  },
  {
    title: 'System',
    description: 'General system settings and configuration',
    href: '/dashboard/settings/system',
    icon: FileText,
    comingSoon: true,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure system settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.href}
              href={category.comingSoon ? '#' : category.href}
              className={category.comingSoon ? 'pointer-events-none' : ''}
            >
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    {category.comingSoon && (
                      <span className="text-xs text-muted-foreground">Coming Soon</span>
                    )}
                  </div>
                  <CardTitle className="mt-4">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
