type Stat = {
  label: string;
  value: string;
};

type Props = {
  stats: Stat[];
};

export function StatsRow({ stats }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm md:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate">{stat.label}</p>
          <p className="mt-3 font-display text-3xl text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
