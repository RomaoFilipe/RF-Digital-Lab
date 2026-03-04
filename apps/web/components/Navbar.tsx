'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

const links = [
  { href: '/', label: 'Home' },
  { href: '/now', label: 'Now' },
  { href: '/about', label: 'Sobre' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060816]/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-mono text-sm text-accent">
            {'</>'}
          </span>
          <span className="font-display text-lg tracking-tight text-white">PortRF</span>
        </Link>
        <nav className="hidden items-center gap-5 text-xs uppercase tracking-[0.28em] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors',
                pathname === link.href ? 'text-white' : 'text-slate hover:text-sand-2',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/contact">Start a project</Link>
          </Button>
        </div>
        <button
          type="button"
          aria-label="Abrir menu"
          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-sand-2 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open ? (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-0 top-[72px] z-50 rounded-b-3xl border-b border-white/10 bg-[#0a1120] p-6 shadow-lift">
            <div className="grid gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm uppercase tracking-[0.3em]',
                    pathname === link.href ? 'text-white' : 'text-slate',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/contact">Falar comigo</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
