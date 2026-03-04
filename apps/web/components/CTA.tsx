import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

type Props = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  className?: string;
};

export function CTA({ title, description, actionLabel, actionHref, className }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-accent/20 bg-[#07111f] p-10 shadow-lift md:p-12',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="absolute -right-16 top-0 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.08),transparent_35%,transparent_60%,rgba(59,130,246,0.08))]" />
      <div className="relative space-y-5">
        <p className="eyebrow">Let&apos;s Build</p>
        <h3 className="font-display text-3xl text-white md:text-4xl">{title}</h3>
        <p className="max-w-2xl text-base leading-8 text-slate">{description}</p>
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
