import { cn } from '../lib/utils';

type PageHeroProps = {
  kicker?: string;
  title: string;
  description: string;
  className?: string;
};

export function PageHero({ kicker, title, description, className }: PageHeroProps) {
  return (
    <section className={cn('container py-14 md:py-16', className)}>
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 shadow-soft backdrop-blur">
        {kicker ? (
          <p className="eyebrow">{kicker}</p>
        ) : null}
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate">{description}</p>
      </div>
    </section>
  );
}
