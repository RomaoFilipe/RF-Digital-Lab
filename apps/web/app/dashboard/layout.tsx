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
    <div className="min-h-screen bg-[#050814]">
      <DashboardTopbar />
      <div className="grid min-h-[calc(100vh-73px)] grid-cols-[260px_1fr]">
        <DashboardNav />
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
