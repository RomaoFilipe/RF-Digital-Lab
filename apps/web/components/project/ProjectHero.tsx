import Link from 'next/link';
import { ContentItem } from '../../lib/types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CopyLinkButton } from '../CopyLinkButton';

type Props = {
  item: ContentItem;
  readingTime: number | null;
};

export function ProjectHero({ item, readingTime }: Props) {
  const demoUrl = item.showcase?.demoUrl || item.devDetails?.liveUrl || null;
  const repoUrl = item.devDetails?.repoUrl || null;
  const views = item.showcase?.views ?? null;

  return (
    <section className="grid gap-8 rounded-3xl border border-white/10 bg-[#0a1120] p-6 shadow-lift md:p-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{item.type}</Badge>
          {item.year ? <Badge variant="outline">{item.year}</Badge> : null}
          {item.featured ? <Badge variant="outline">Featured</Badge> : null}
          {readingTime ? <Badge variant="outline">{readingTime} min read</Badge> : null}
          {views !== null ? <Badge variant="outline">{views} views</Badge> : null}
        </div>

        <h1 className="break-words font-display text-4xl tracking-tight text-white md:text-6xl">
          {item.title}
        </h1>

        {item.summary ? <p className="text-wrap-anywhere max-w-3xl text-base leading-8 text-slate">{item.summary}</p> : null}

        <div className="flex flex-wrap gap-3">
          {demoUrl ? (
            <Button asChild size="sm">
              <a href={demoUrl} target="_blank" rel="noreferrer">
                View demo
              </a>
            </Button>
          ) : null}
          {repoUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={repoUrl} target="_blank" rel="noreferrer">
                View repository
              </a>
            </Button>
          ) : null}
          <CopyLinkButton />
          <Button asChild size="sm" variant="outline">
            <Link href="/projects">View more projects</Link>
          </Button>
        </div>
      </div>

      <aside className="panel min-w-0 p-5">
        <p className="eyebrow">Project Snapshot</p>
        <h2 className="mt-2 font-display text-2xl text-white">Build profile</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate">Status</p>
            <p className="mt-2 break-words text-sm text-white">{item.status}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate">Updated</p>
            <p className="mt-2 break-words text-sm text-white">
              {new Date(item.updatedAt).toLocaleDateString('pt-PT')}
            </p>
          </div>
          {item.showcase?.teamSize ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate">Team size</p>
              <p className="mt-2 break-words text-sm text-white">{item.showcase.teamSize}</p>
            </div>
          ) : null}
          {item.showcase?.developmentTimeDays ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate">Delivery</p>
              <p className="mt-2 break-words text-sm text-white">{item.showcase.developmentTimeDays} days</p>
            </div>
          ) : null}
        </div>
      </aside>
    </section>
  );
}
