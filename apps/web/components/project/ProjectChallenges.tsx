type Props = {
  challenges?: string[] | null;
  learnings?: string[] | null;
};

export function ProjectChallenges({ challenges, learnings }: Props) {
  const hasChallenges = Boolean(challenges?.length);
  const hasLearnings = Boolean(learnings?.length);
  if (!hasChallenges && !hasLearnings) return null;

  return (
    <section className="panel p-8">
      <h2 className="font-display text-2xl text-white">Challenges and learnings</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {hasChallenges ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">Challenges</p>
            <ul className="mt-3 space-y-2 text-sm text-slate">
              {challenges!.map((item, index) => (
                <li key={`${item}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {hasLearnings ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">Learnings</p>
            <ul className="mt-3 space-y-2 text-sm text-slate">
              {learnings!.map((item, index) => (
                <li key={`${item}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
