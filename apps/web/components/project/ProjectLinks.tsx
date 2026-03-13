import { ShowcaseLink } from '../../lib/types';

type LinkItem = {
  label: string;
  url: string;
};

type Props = {
  items?: ShowcaseLink[] | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  canonicalUrl?: string | null;
  publicationUrl?: string | null;
};

export function ProjectLinks({ items, repoUrl, liveUrl, canonicalUrl, publicationUrl }: Props) {
  const merged: LinkItem[] = [
    ...(repoUrl ? [{ label: 'Repository', url: repoUrl }] : []),
    ...(liveUrl ? [{ label: 'Live demo', url: liveUrl }] : []),
    ...(canonicalUrl ? [{ label: 'Documentation', url: canonicalUrl }] : []),
    ...(publicationUrl ? [{ label: 'Publication', url: publicationUrl }] : []),
    ...((items || []).map((item) => ({ label: item.label, url: item.url })) || []),
  ];

  const deduped = Array.from(new Map(merged.map((item) => [item.url, item])).values());
  if (!deduped.length) return null;

  return (
    <section className="panel p-6">
      <h3 className="font-display text-xl text-white">Links</h3>
      <div className="mt-4 grid gap-2">
        {deduped.map((item) => (
          <a
            key={`${item.label}-${item.url}`}
            href={item.url}
            className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm hover:bg-white/[0.05]"
            target="_blank"
            rel="noreferrer"
          >
            <p className="font-medium text-accent">{item.label}</p>
            <p className="mt-1 text-wrap-anywhere text-xs text-slate">{item.url}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
