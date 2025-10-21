import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav';
import { Breadcrumb } from './breadcrumb';

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav user={user} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {/* Breadcrumb */}
            <div className="mb-4">
              <Breadcrumb />
            </div>

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
