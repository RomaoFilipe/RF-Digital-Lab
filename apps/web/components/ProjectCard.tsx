import Link from 'next/link';
import { ContentItem } from '../lib/types';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { estimateReadingTime } from '../lib/readingTime';

type Props = {
  item: ContentItem;
  imageBase?: string;
  className?: string;
  variant?: 'default' | 'feature';
  onQuickView?: (() => void) | null;
};

export function ProjectCard({
  item,
  imageBase = '',
  className,
  variant = 'default',
  onQuickView,
}: Props) {
  const readingTime =
    item.type === 'ARTICLE'
      ? item.articleDetails?.readingTime ?? estimateReadingTime(item.content || '')
      : null;

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-soft transition hover:-translate-y-1 hover:border-accent/30 hover:bg-white/[0.05]',
        variant === 'feature' ? 'md:col-span-2' : '',
        className,
      )}
    >
      <Link href={`/project/${item.slug}`} className="block">
        {item.coverMedia ? (
          <div className={cn('relative overflow-hidden border-b border-white/10', variant === 'feature' ? 'h-72' : 'h-52')}>
            <img
              src={`${imageBase}${item.coverMedia.path}`}
              alt={item.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08111f] via-[#08111f]/30 to-transparent" />
          </div>
        ) : (
          <div className={cn('flex items-center justify-center bg-[#0d1526] font-mono text-xs uppercase tracking-[0.3em] text-slate', variant === 'feature' ? 'h-72' : 'h-52')}>
            no cover
          </div>
        )}
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{item.type}</Badge>
          {item.year ? <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">{item.year}</span> : null}
          {readingTime ? <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">{readingTime} min read</span> : null}
        </div>
        <Link href={`/project/${item.slug}`}>
          <h3 className="mt-4 font-display text-2xl text-white">{item.title}</h3>
        </Link>
        {item.summary ? <p className="mt-3 text-sm leading-7 text-slate">{item.summary}</p> : null}
        {item.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((tag) => (
              <Badge key={tag.tag.id} variant="outline">
                {tag.tag.name}
              </Badge>
            ))}
          </div>
        ) : null}
        {item.showcase?.technologies?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.showcase.technologies.slice(0, 4).map((tech) => (
              <Badge key={`tech-${tech.slug || tech.name}`} variant="outline">
                {tech.name}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="mt-6 flex items-center gap-3">
          <Button asChild size="sm">
            <Link href={`/project/${item.slug}`}>Open case</Link>
          </Button>
          {onQuickView ? (
            <Button type="button" variant="outline" size="sm" onClick={onQuickView}>
              Quick view
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
