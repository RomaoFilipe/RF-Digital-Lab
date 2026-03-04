import { ServiceItem } from '../lib/content/types';
import { Card } from './ui/card';

type Props = {
  item: ServiceItem;
};

export function ServiceCard({ item }: Props) {
  return (
    <Card className="h-full">
      <div className="space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">{item.timeline}</p>
          <h3 className="mt-3 font-display text-2xl text-white">{item.title}</h3>
        </div>
        <p className="text-sm leading-7 text-slate">{item.summary}</p>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Deliverables</p>
          <ul className="mt-3 space-y-2 text-sm text-slate">
            {item.deliverables.map((deliverable) => (
              <li key={deliverable}>{deliverable}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-sand-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Format</p>
          <p className="mt-2">{item.engagementModel}</p>
        </div>
      </div>
    </Card>
  );
}
