import Link from 'next/link';
import { getApiBaseUrl } from '../lib/api';
import { ContentItem, Paginated } from '../lib/types';
import { Section } from '../components/Section';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { CTA } from '../components/CTA';
import { StatsRow } from '../components/StatsRow';
import { Button } from '../components/ui/button';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { testimonialsContent } from '../lib/content/testimonials';

async function getFeatured() {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/content?featured=true&limit=6`, { cache: 'no-store' });
  if (!res.ok) {
    return {
      items: [],
      page: 1,
      limit: 6,
      total: 0,
      totalPages: 0,
    } satisfies Paginated<ContentItem>;
  }
  return res.json() as Promise<Paginated<ContentItem>>;
}

async function getCount(query: string) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/content?${query}`, { cache: 'no-store' });
  if (!res.ok) return 0;
  const data = (await res.json()) as Paginated<ContentItem>;
  return data.total;
}

async function getStats() {
  const tabs = ['video', 'image', 'editing', 'dev', '3d', 'article', 'publication', 'other'];
  const [total, featured, ...tabCounts] = await Promise.all([
    getCount('limit=1'),
    getCount('featured=true&limit=1'),
    ...tabs.map((tab) => getCount(`tab=${tab}&limit=1`)),
  ]);
  const areas = tabCounts.filter((count) => count > 0).length;
  return { total, featured, areas };
}

export default async function HomePage() {
  const featured = await getFeatured();
  const stats = await getStats();
  const imageBase = getApiBaseUrl();

  return (
    <div>
      <section className="container py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07101f] p-8 shadow-lift md:p-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
          <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-full w-[45%] bg-[linear-gradient(180deg,rgba(56,189,248,0.08),transparent_40%,rgba(59,130,246,0.08))]" />
          <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <p className="eyebrow">Developer Portfolio</p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Interfaces, systems and products built with engineering discipline.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate">
                Portfolio profissional para apresentar software, arquitetura, produto e execução com uma linguagem visual mais próxima de Vercel, Linear e GitHub do que de um portfolio criativo genérico.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/projects">Browse projects</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Book a call</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Docker'].map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-slate"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="panel p-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate">System overview</p>
                  <span className="rounded-full bg-success/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-success">
                    available
                  </span>
                </div>
                <div className="mt-5 grid gap-4">
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">Focus</p>
                    <p className="mt-3 text-sm leading-7 text-sand-2">
                      Full-stack product work, admin systems, public websites and design systems with clean DX.
                    </p>
                  </div>
                  <StatsRow
                    stats={[
                      { label: 'Projects', value: String(stats.total) },
                      { label: 'Featured', value: String(stats.featured) },
                      { label: 'Areas', value: String(stats.areas) },
                    ]}
                  />
                </div>
              </div>
              <div className="panel-muted p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate">What you get</p>
                <div className="mt-4 grid gap-3 text-sm text-slate">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                    <p>Product-grade UI direction instead of a generic portfolio theme.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                    <p>Clear case studies, stack details, metadata and admin tooling.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                    <p>Visual identity that feels credible for engineering-led work.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        kicker="Selected work"
        title="Recent builds with clear product intent"
        subtitle="A selection of published work across development, articles and public-facing systems."
      >
        <FeaturedCarousel items={featured.items} imageBase={imageBase} />
      </Section>

      <Section
        kicker="Approach"
        title="Built like a product, not styled like a template"
        subtitle="The goal is not decorative UI. It is to communicate structure, technical credibility and execution quality."
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel p-8">
            <div className="space-y-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate">01 / Product thinking</p>
              <p className="text-base leading-8 text-slate">
                Cada interface é tratada como um sistema. Priorizo arquitetura da informação, estados, clareza e manutenibilidade. O design serve a leitura do produto.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate">02 / Technical execution</p>
              <p className="text-base leading-8 text-slate">
                Trabalho com front-end, back-end e infraestrutura suficiente para entregar algo coeso, não só mockups. O resultado precisa de parecer real porque é real.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate">03 / Professional polish</p>
              <p className="text-base leading-8 text-slate">
                Micro-interações, hierarquia tipográfica, componentes consistentes e admin utilizável. O detalhe importa porque credibilidade visual também comunica competência.
              </p>
            </div>
          </div>
          <div className="panel-muted p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate">Capabilities</p>
            <ul className="mt-5 space-y-3 text-sm text-sand-2">
              <li>Web apps and internal tools</li>
              <li>Portfolio and product marketing sites</li>
              <li>Design systems and interaction polish</li>
              <li>Content structures for case studies and articles</li>
            </ul>
            <Button asChild size="sm" variant="outline" className="mt-6">
              <Link href="/about">Read profile</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section
        kicker="Proof"
        title="Signals from real collaboration"
        subtitle="Short feedback blocks from work delivered in product, systems and communication-heavy contexts."
      >
        <TestimonialsCarousel items={testimonialsContent} />
      </Section>

      <section className="container py-16">
        <CTA
          title="Need a portfolio or product interface that looks credible?"
          description="If the current site feels generic, the problem is usually not color. It is the lack of a systems-first visual language. That is what this redesign fixes."
          actionLabel="Start a conversation"
          actionHref="/contact"
        />
      </section>
    </div>
  );
}
