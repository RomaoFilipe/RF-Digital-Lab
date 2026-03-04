import { apiFetch } from '../../../lib/api';
import { ContentItem, Paginated } from '../../../lib/types';
import { ContentFilters } from '../../../components/ContentFilters';
import { Pagination } from '../../../components/Pagination';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { DashboardContentTable } from '../../../components/DashboardContentTable';

async function getContent(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }
  });
  const qs = params.toString();
  return apiFetch<Paginated<ContentItem>>(`/content/admin/list${qs ? `?${qs}` : ''}`);
}

export default async function ContentListPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = await getContent(searchParams);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Content</p>
        <h1 className="font-display text-4xl text-white">Content registry</h1>
        <p className="mt-2 text-sm text-slate">Manage portfolio entries, publication states and quick actions from one table.</p>
      </div>

      <ContentFilters />

      {data.items.length ? (
        <DashboardContentTable items={data.items} />
      ) : (
        <Card className="space-y-3">
          <h3 className="font-display text-xl text-white">No content yet</h3>
          <p className="text-sm text-slate">Create the first project or article to start populating the public archive.</p>
          <Button asChild size="sm">
            <Link href="/dashboard/content/new">New content</Link>
          </Button>
        </Card>
      )}

      <Pagination page={data.page} totalPages={data.totalPages} basePath="/dashboard/content" />
    </div>
  );
}
