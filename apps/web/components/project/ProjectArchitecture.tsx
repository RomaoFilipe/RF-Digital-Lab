import { ShowcaseArchitectureNode } from '../../lib/types';

type Props = {
  items?: ShowcaseArchitectureNode[] | null;
};

export function ProjectArchitecture({ items }: Props) {
  if (!items?.length) return null;

  return (
    <section className="panel p-8">
      <h2 className="font-display text-2xl text-white">Project architecture</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item, index) => (
          <div key={`${item.layer}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">{item.layer}</p>
            <p className="mt-2 text-sm text-white">{item.value}</p>
            {item.notes ? <p className="mt-1 text-xs text-slate">{item.notes}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
