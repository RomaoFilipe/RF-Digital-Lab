import { notFound, redirect } from 'next/navigation';
import { getApiBaseUrl } from '../../../lib/api';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function resolveSlug(id: string) {
  const base = getApiBaseUrl();
  const endpoint = UUID_RE.test(id) ? `/content/public-id/${id}` : `/content/${id}`;
  const res = await fetch(`${base}${endpoint}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to resolve project route');
  const json = (await res.json()) as { slug?: string };
  return json.slug || null;
}

export default async function LegacyProjectsIdPage({ params }: { params: { id: string } }) {
  const slug = await resolveSlug(params.id);
  if (!slug) notFound();
  redirect(`/project/${slug}`);
}
