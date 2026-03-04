'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

const nav = [
  { href: '/dashboard', label: 'Resumo' },
  { href: '/dashboard/content', label: 'Conteúdos' },
  { href: '/dashboard/media', label: 'Media' },
  { href: '/dashboard/tags', label: 'Tags' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[73px] flex h-[calc(100vh-73px)] flex-col gap-4 border-r border-white/10 bg-[#070d19] p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-slate">Admin surface</span>
      {nav.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-xl border px-3 py-2.5 text-sm transition',
              isActive
                ? 'border-accent/30 bg-accent/12 text-accent'
                : 'border-transparent text-slate hover:border-white/10 hover:bg-white/[0.03] hover:text-white',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
