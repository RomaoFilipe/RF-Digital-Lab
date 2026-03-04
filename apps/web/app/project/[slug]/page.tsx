import Link from 'next/link';
import { getApiBaseUrl } from '../../../lib/api';
import { ContentItem } from '../../../lib/types';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { CopyLinkButton } from '../../../components/CopyLinkButton';
import { estimateReadingTime } from '../../../lib/readingTime';
import { parseCaseStudySections } from '../../../lib/case-study';
import { renderMarkdown } from '../../../lib/markdown';
import { ProjectCard } from '../../../components/ProjectCard';

async function getProject(slug: string) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/content/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Project not found');
  return res.json() as Promise<ContentItem>;
}

async function getRelatedProjects(item: ContentItem) {
  const tags = item.tags?.map((entry) => entry.tag.slug).filter(Boolean) ?? [];
  if (!tags.length) return [];

  const base = getApiBaseUrl();
  const params = new URLSearchParams({
    tags: tags.join(','),
    limit: '6',
  });
  const res = await fetch(`${base}/content?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json() as { items: ContentItem[] };
  return json.items.filter((candidate) => candidate.id !== item.id).slice(0, 3);
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const item = await getProject(params.slug);
  const base = getApiBaseUrl();
  const relatedProjects = await getRelatedProjects(item);
  const caseStudy = parseCaseStudySections(item.content || '');
  const readingTime =
    item.type === 'ARTICLE'
      ? item.articleDetails?.readingTime ?? estimateReadingTime(item.content || '')
      : null;

  return (
    <div className="container py-16">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{item.type}</Badge>
          {item.year ? <Badge variant="outline">{item.year}</Badge> : null}
          {item.tags?.map((t) => (
            <Link key={t.tag.id} href={`/projects?tags=${t.tag.slug}`}>
              <Badge variant="outline">{t.tag.name}</Badge>
            </Link>
          ))}
          {caseStudy.hasCaseStudy ? <Badge variant="outline">Case Study</Badge> : null}
          {readingTime ? (
            <Badge variant="outline">
              Tempo estimado: {readingTime} min
            </Badge>
          ) : null}
        </div>
        <h1 className="font-display text-5xl tracking-tight text-white md:text-6xl">{item.title}</h1>
        {item.summary ? <p className="max-w-3xl text-lg leading-8 text-slate">{item.summary}</p> : null}
      </div>

      {item.coverMedia ? (
        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-lift">
          <img
            src={`${base}${item.coverMedia.path}`}
            alt={item.title}
            className="h-96 w-full object-cover"
          />
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          {caseStudy.hasCaseStudy ? (
            <>
              <section>
                <h2 className="font-display text-2xl">Desafio</h2>
                <article
                  className="markdown mt-4"
                  dangerouslySetInnerHTML={{ __html: caseStudy.challengeHtml }}
                />
              </section>
              <section>
                <h2 className="font-display text-2xl">Processo</h2>
                <article
                  className="markdown mt-4"
                  dangerouslySetInnerHTML={{ __html: caseStudy.processHtml }}
                />
              </section>
              <section>
                <h2 className="font-display text-2xl">Resultado</h2>
                <article
                  className="markdown mt-4"
                  dangerouslySetInnerHTML={{ __html: caseStudy.resultHtml }}
                />
              </section>
              {caseStudy.restHtml ? (
                <section className="panel p-8">
                  <h2 className="font-display text-2xl">Notas</h2>
                  <article
                    className="markdown mt-4"
                    dangerouslySetInnerHTML={{ __html: caseStudy.restHtml }}
                  />
                </section>
              ) : null}
            </>
          ) : (
            <section className="panel p-8">
              <h2 className="font-display text-2xl">Overview</h2>
              <article
                className="markdown mt-4"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content || '') }}
              />
            </section>
          )}

          {item.gallery?.length ? (
            <section className="panel p-8">
              <h2 className="font-display text-2xl">Gallery</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {item.gallery.map((g) => (
                  <img
                    key={g.media.id}
                    src={`${base}${g.media.path}`}
                    alt={g.media.originalName}
                    className="h-56 w-full rounded-2xl border border-white/10 object-cover"
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <h3 className="font-display text-xl text-white">Share</h3>
            <p className="mt-2 text-sm text-slate">Copy the public URL for this project.</p>
            <div className="mt-4">
              <CopyLinkButton />
            </div>
          </div>
          <div className="panel p-6">
            <h3 className="font-display text-xl text-white">Details</h3>
            <div className="mt-4 space-y-3 text-sm">
              {item.videoDetails?.youtubeUrl ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate">YouTube</p>
                  <a href={item.videoDetails.youtubeUrl} className="text-accent" target="_blank" rel="noreferrer">
                    Ver vídeo
                  </a>
                </div>
              ) : null}
              {item.videoDetails?.vimeoUrl ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate">Vimeo</p>
                  <a href={item.videoDetails.vimeoUrl} className="text-accent" target="_blank" rel="noreferrer">
                    Ver vídeo
                  </a>
                </div>
              ) : null}
              {item.devDetails?.repoUrl ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate">Repo</p>
                  <a href={item.devDetails.repoUrl} className="text-accent" target="_blank" rel="noreferrer">
                    Abrir repositório
                  </a>
                </div>
              ) : null}
              {item.devDetails?.liveUrl ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate">Live</p>
                  <a href={item.devDetails.liveUrl} className="text-accent" target="_blank" rel="noreferrer">
                    Ver site
                  </a>
                </div>
              ) : null}
              {item.devDetails?.stack ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate">Stack</p>
                  <p>{item.devDetails.stack}</p>
                </div>
              ) : null}
              {item.articleDetails?.canonicalUrl ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate">Artigo</p>
                  <a href={item.articleDetails.canonicalUrl} className="text-accent" target="_blank" rel="noreferrer">
                    Ler artigo
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-[#08111f] p-6">
            <h3 className="font-display text-xl text-white">Need something similar?</h3>
            <p className="mt-3 text-sm leading-7 text-slate">
              I can help design and build the next public-facing product, admin system or technical portfolio.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </aside>
      </div>

      {relatedProjects.length ? (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Related</p>
              <h2 className="mt-2 font-display text-3xl text-white">Related projects</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedProjects.map((related) => (
              <ProjectCard key={related.id} item={related} imageBase={base} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
