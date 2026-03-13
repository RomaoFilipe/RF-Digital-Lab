import { BadgeCheck, Server, Shield, Sparkles } from 'lucide-react';
import { ShowcaseFeature } from '../../lib/types';

type Props = {
  features?: ShowcaseFeature[] | null;
};

const ICON_MAP: Record<string, typeof BadgeCheck> = {
  auth: Shield,
  api: Server,
  ux: Sparkles,
};

export function ProjectFeatures({ features }: Props) {
  if (!features?.length) return null;

  return (
    <section className="panel p-8">
      <h2 className="font-display text-2xl text-white">Features</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {features.map((feature, index) => {
          const iconKey = (feature.icon || '').toLowerCase();
          const Icon = ICON_MAP[iconKey] || BadgeCheck;
          return (
            <div
              key={`${feature.name}-${index}`}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-start gap-3">
                <Icon size={16} className="mt-0.5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-white">{feature.name}</p>
                  {feature.description ? (
                    <p className="mt-1 text-xs leading-6 text-slate">{feature.description}</p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
