import { cn } from '../lib/utils';

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export function Section({ kicker, title, subtitle, children, className }: Props) {
  return (
    <section className={cn('py-12 md:py-16', className)}>
      <div className="container">
        {kicker ? (
          <p className="eyebrow">{kicker}</p>
        ) : null}
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        {children ? <div className="mt-8 animate-fade-up">{children}</div> : null}
      </div>
    </section>
  );
}
