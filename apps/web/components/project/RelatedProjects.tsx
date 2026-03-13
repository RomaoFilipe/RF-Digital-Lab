import { ContentItem } from '../../lib/types';
import { ProjectCard } from '../ProjectCard';

type Props = {
  items: ContentItem[];
  imageBase: string;
};

export function RelatedProjects({ items, imageBase }: Props) {
  if (!items.length) return null;

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Related</p>
          <h2 className="mt-2 font-display text-3xl text-white">Related projects</h2>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <ProjectCard key={item.id} item={item} imageBase={imageBase} />
        ))}
      </div>
    </section>
  );
}
