'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  content: 'Conteúdos',
  media: 'Media',
  tags: 'Tags',
  settings: 'Settings',
  messages: 'Messages',
  new: 'Novo',
};

export function DashboardTopbar() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = parts.map((part) => LABELS[part] || part);
  const showNewContent = pathname === '/dashboard' || pathname === '/dashboard/content';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#060816]/85 px-4 py-4 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.28em] text-slate">
        {crumbs.map((crumb, index) => (
          <span key={`${crumb}-${index}`} className="truncate">
            {crumb}
            {index < crumbs.length - 1 ? ' / ' : ''}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/">Ver site</Link>
        </Button>
        {showNewContent ? (
          <Button asChild size="sm">
            <Link href="/dashboard/content/new">Novo conteúdo</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
