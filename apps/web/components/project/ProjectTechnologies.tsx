import Link from 'next/link';
import { ShowcaseItem } from '../../lib/types';
import { Badge } from '../ui/badge';

type Props = {
  technologies?: ShowcaseItem[] | null;
  tools?: ShowcaseItem[] | null;
  software?: ShowcaseItem[] | null;
};

function Block({ title, items }: { title: string; items: ShowcaseItem[] }) {
  if (!items.length) return null;
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Link key={`${title}-${item.slug || item.name}`} href={`/projects?tech=${item.slug || item.name}`}>
            <Badge variant="outline" className="max-w-full text-wrap-anywhere">
              {item.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ProjectTechnologies({ technologies, tools, software }: Props) {
  const hasContent = Boolean(technologies?.length || tools?.length || software?.length);
  if (!hasContent) return null;

  return (
    <section className="panel p-8">
      <h2 className="font-display text-2xl text-white">Technologies and software used</h2>
      <p className="mt-2 text-sm text-slate">Frameworks, tools and production software used in this project.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Block title="Technologies" items={technologies || []} />
        <Block title="Tools" items={tools || []} />
        <Block title="Software" items={software || []} />
      </div>
    </section>
  );
}
