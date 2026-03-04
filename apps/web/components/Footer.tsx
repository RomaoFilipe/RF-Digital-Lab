import Link from 'next/link';

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/now', label: 'Now' },
  { href: '/about', label: 'Sobre' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

const resourceLinks = [
  { href: '/toolkit', label: 'Toolkit' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050814] py-12">
      <div className="container grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <h3 className="font-display text-2xl text-white">PortRF</h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate">
            Portfolio e dashboard com linguagem de produto, engenharia e execução profissional.
          </p>
          <p className="mt-6 text-xs text-slate">© {new Date().getFullYear()} PortRF</p>
        </div>
        <div className="grid gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Navigation</span>
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="grid gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Resources</span>
          {resourceLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
