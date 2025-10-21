import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardLayout
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        avatar: session.user.avatar,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
