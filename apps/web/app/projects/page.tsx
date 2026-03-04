import { ProjectFilters } from '../../components/ProjectFilters';
import { Pagination } from '../../components/Pagination';
import { ContentItem, Paginated } from '../../lib/types';
import { getApiBaseUrl } from '../../lib/api';
import { Section } from '../../components/Section';
import { ProjectsExplorer } from '../../components/ProjectsExplorer';

async function getProjects(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }
  });

  const base = getApiBaseUrl();
  const url = `${base}/content${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json() as Promise<Paginated<ContentItem>>;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = await getProjects(searchParams);
  const imageBase = getApiBaseUrl();

  return (
    <div>
      <Section
        kicker="Projects"
        title="Project archive"
        subtitle="A technical catalogue of published work. Filter by area, tags, year and featured status."
      >
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em]">{data.total} indexed items</span>
        </div>
        <div className="mt-6">
          <ProjectFilters />
        </div>
        <div className="mt-10">
          {data.items.length ? (
            <ProjectsExplorer items={data.items} imageBase={imageBase} />
          ) : (
            <div className="panel p-10 text-sm text-slate">
              No projects matched the current filters.
            </div>
          )}
        </div>
        <Pagination page={data.page} totalPages={data.totalPages} basePath="/projects" />
      </Section>
    </div>
  );
}
