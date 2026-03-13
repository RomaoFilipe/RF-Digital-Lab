import { redirect } from 'next/navigation';
import { getMe } from '../../lib/auth';
import { DashboardNav } from '../../components/DashboardNav';
import { DashboardTopbar } from '../../components/DashboardTopbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();
  if (!me) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#050814]">
      <DashboardTopbar />
      <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        <DashboardNav />
        <div className="min-w-0 p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
