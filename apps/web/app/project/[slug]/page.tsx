import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getApiBaseUrl } from '../../../lib/api';
import { ContentItem, ShowcaseFeature, ShowcaseItem } from '../../../lib/types';
import { estimateReadingTime } from '../../../lib/readingTime';
import { parseCaseStudySections } from '../../../lib/case-study';
import { ProjectHero } from '../../../components/project/ProjectHero';
import { ProjectTechnologies } from '../../../components/project/ProjectTechnologies';
import { ProjectOverview } from '../../../components/project/ProjectOverview';
import { ProjectFeatures } from '../../../components/project/ProjectFeatures';
import { ProjectGallery } from '../../../components/project/ProjectGallery';
import { ProjectVideoDemo } from '../../../components/project/ProjectVideoDemo';
import { ProjectArchitecture } from '../../../components/project/ProjectArchitecture';
import { ProjectStats } from '../../../components/project/ProjectStats';
import { ProjectLinks } from '../../../components/project/ProjectLinks';
import { ProjectChallenges } from '../../../components/project/ProjectChallenges';
import { RelatedProjects } from '../../../components/project/RelatedProjects';
import { ProjectCTA } from '../../../components/project/ProjectCTA';
import { ProjectViewTracker } from '../../../components/project/ProjectViewTracker';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getProject(slug: string) {
  const base = getApiBaseUrl();
  const endpoint = UUID_RE.test(slug) ? `/content/public-id/${slug}` : `/content/${slug}`;
  const res = await fetch(`${base}${endpoint}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load project');
  return res.json() as Promise<ContentItem>;
}

function fromCsv(raw?: string | null): ShowcaseItem[] {
  return (raw || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => ({
      name: entry,
      slug: entry
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
    }));
}

function featureFromCsv(raw?: string | null): ShowcaseFeature[] {
  return (raw || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => ({
      name: entry,
      icon: 'bolt',
    }));
}

async function getRelatedProjects(item: ContentItem) {
  const base = getApiBaseUrl();
  const tech = item.showcase?.techSlugs?.slice(0, 4) || [];
  const tagSlugs = item.tags?.map((entry) => entry.tag.slug).filter(Boolean) ?? [];
  const query = new URLSearchParams({ limit: '8' });
  if (tech.length) query.set('tech', tech.join(','));
  else if (tagSlugs.length) query.set('tags', tagSlugs.join(','));
  else return [];

  const res = await fetch(`${base}/content?${query.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = (await res.json()) as { items: ContentItem[] };
  return json.items.filter((candidate) => candidate.id !== item.id).slice(0, 3);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getProject(params.slug);
  if (!item) {
    return {
      title: 'Project not found',
    };
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: item.seoTitle || item.title,
    description: item.seoDescription || item.summary || undefined,
    alternates: {
      canonical: `${siteUrl}/project/${item.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const item = await getProject(params.slug);
  if (!item) notFound();
  if (UUID_RE.test(params.slug) && item.slug !== params.slug) {
    redirect(`/project/${item.slug}`);
  }

  const base = getApiBaseUrl();
  const relatedProjects = await getRelatedProjects(item);
  const caseStudy = parseCaseStudySections(item.content || '');
  const readingTime =
    item.type === 'ARTICLE'
      ? item.articleDetails?.readingTime ?? estimateReadingTime(item.content || '')
      : null;

  const galleryItems = item.gallery?.map((entry) => ({
    src: `${base}${entry.media.path}`,
    alt: entry.media.originalName || item.title,
  })) || [];

  const technologies = item.showcase?.technologies?.length
    ? item.showcase.technologies
    : fromCsv(item.devDetails?.stack);
  const tools = item.showcase?.tools || [];
  const software = item.showcase?.software?.length
    ? item.showcase.software
    : fromCsv(item.threeDDetails?.software);
  const features = item.showcase?.features?.length
    ? item.showcase.features
    : featureFromCsv(item.devDetails?.highlights);

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <ProjectViewTracker slug={item.slug} apiBase={base} />

        <ProjectHero item={item} readingTime={readingTime} />

        {item.coverMedia ? (
          <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-lift">
            <img
              src={`${base}${item.coverMedia.path}`}
              alt={item.title}
              className="h-72 w-full object-cover md:h-96"
            />
          </div>
        ) : null}

        <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="min-w-0 space-y-8">
            <ProjectTechnologies
              technologies={technologies}
              tools={tools}
              software={software}
            />
            <ProjectOverview markdown={item.content || ''} caseStudy={caseStudy} />
            <ProjectFeatures features={features} />
            <ProjectGallery items={galleryItems} />
            <ProjectVideoDemo
              demoUrl={item.showcase?.demoUrl}
              videoUrl={item.showcase?.videoUrl}
              videoProvider={item.showcase?.videoProvider}
              videoAsset={item.showcase?.videoAsset}
              videoAssetSrc={item.showcase?.videoAsset ? `${base}${item.showcase.videoAsset.path}` : null}
            />
            <ProjectArchitecture items={item.showcase?.architecture} />
            <ProjectStats items={item.showcase?.stats} />
            <ProjectChallenges
              challenges={item.showcase?.challenges}
              learnings={item.showcase?.learnings}
            />
          </div>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-6 lg:self-start">
            <ProjectLinks
              items={item.showcase?.links}
              repoUrl={item.devDetails?.repoUrl}
              liveUrl={item.devDetails?.liveUrl || item.showcase?.demoUrl}
              canonicalUrl={item.articleDetails?.canonicalUrl}
              publicationUrl={item.publicationDetails?.postUrl}
            />
            <ProjectCTA />
          </aside>
        </div>
        <RelatedProjects items={relatedProjects} imageBase={base} />
      </div>
    </div>
  );
}
