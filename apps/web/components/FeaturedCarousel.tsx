'use client';

import { useRef } from 'react';
import { ContentItem } from '../lib/types';
import { ProjectCard } from './ProjectCard';
import { Button } from './ui/button';

type Props = {
  items: ContentItem[];
  imageBase: string;
};

export function FeaturedCarousel({ items, imageBase }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  function scrollByDir(dir: 'prev' | 'next') {
    if (!containerRef.current) return;
    const distance = containerRef.current.clientWidth * 0.8 + 24;
    containerRef.current.scrollBy({
      left: dir === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  }

  if (!items.length) {
    return (
      <div className="panel p-10 text-sm text-slate">
        No published featured projects yet. Publish content from the dashboard first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Featured set</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => scrollByDir('prev')}>
            Prev
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => scrollByDir('next')}>
            Next
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory] scroll-smooth"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[80%] snap-start md:min-w-[320px]"
          >
            <ProjectCard item={item} imageBase={imageBase} />
          </div>
        ))}
      </div>
    </div>
  );
}
