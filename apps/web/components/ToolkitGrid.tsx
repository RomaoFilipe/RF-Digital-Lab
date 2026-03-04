import { ToolkitSection } from '../lib/content/types';
import { Card } from './ui/card';

type Props = {
  sections: ToolkitSection[];
};

export function ToolkitGrid({ sections }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sections.map((section) => (
        <Card key={section.title}>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">{section.title}</p>
          <div className="mt-5 space-y-4">
            {section.items.map((item) => (
              <div key={item.name} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl text-white">{item.name}</h3>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent"
                    >
                      Link
                    </a>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-7 text-slate">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
