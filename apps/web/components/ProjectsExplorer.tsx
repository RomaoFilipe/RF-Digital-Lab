'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ContentItem } from '../lib/types';
import { ProjectCard } from './ProjectCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type Props = {
  items: ContentItem[];
  imageBase: string;
};

export function ProjectsExplorer({ items, imageBase }: Props) {
  const [active, setActive] = useState<ContentItem | null>(null);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => {
          const isFeatureCard =
            item.type === 'ARTICLE' ||
            item.type === 'PUBLICATION' ||
            (item.content?.length || 0) > 900 ||
            index === 0;

          return (
            <ProjectCard
              key={item.id}
              item={item}
              imageBase={imageBase}
              variant={isFeatureCard ? 'feature' : 'default'}
              onQuickView={() => setActive(item)}
            />
          );
        })}
      </div>

      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0a1120] p-6 shadow-lift">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{active.type}</Badge>
                  {active.year ? <Badge variant="outline">{active.year}</Badge> : null}
                </div>
                <h3 className="mt-4 font-display text-3xl text-white">{active.title}</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setActive(null)}>
                Close
              </Button>
            </div>
            {active.coverMedia ? (
              <img
                src={`${imageBase}${active.coverMedia.path}`}
                alt={active.title}
                className="mt-6 h-64 w-full rounded-2xl border border-white/10 object-cover"
              />
            ) : null}
            {active.summary ? <p className="mt-6 text-sm leading-7 text-slate">{active.summary}</p> : null}
            {active.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {active.tags.map((tag) => (
                  <Badge key={tag.tag.id} variant="outline">
                    {tag.tag.name}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="mt-6 flex gap-3">
              <Button asChild size="sm">
                <Link href={`/project/${active.slug}`}>Open case</Link>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setActive(null)}>
                Continue browsing
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
