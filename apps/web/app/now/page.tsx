import { CTA } from '../../components/CTA';
import { PageHero } from '../../components/PageHero';
import { Card } from '../../components/ui/card';
import { nowContent } from '../../lib/content/now';

const blocks = [
  { title: 'O que estou a fazer', items: nowContent.focus },
  { title: 'O que estou a ler', items: nowContent.reading },
  { title: 'O que estou a estudar', items: nowContent.studying },
  { title: 'O que estou a construir', items: nowContent.building },
];

export default function NowPage() {
  return (
    <div>
      <PageHero
        kicker="Now"
        title="Current focus and active tracks"
        description="A quick snapshot of what is being built, studied and refined right now."
      />

      <section className="container pb-8">
        <div className="grid gap-6 md:grid-cols-2">
          {blocks.map((block) => (
            <Card key={block.title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">{block.title}</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-slate">
          Updated at {nowContent.updatedAt}
        </p>
      </section>

      <section className="container py-16">
        <CTA
          title="Want to see how this translates into shipped work?"
          description="Published projects show how these focus areas become interfaces, systems and concrete execution."
          actionLabel="Explore projects"
          actionHref="/projects"
        />
      </section>
    </div>
  );
}
