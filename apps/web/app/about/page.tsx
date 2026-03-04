import { Section } from '../../components/Section';
import { CTA } from '../../components/CTA';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

export default function AboutPage() {
  return (
    <div>
      <Section
        kicker="About"
        title="Engineering-led design with product discipline"
        subtitle="This profile page now leans into structure, technical clarity and execution instead of a generic creative portfolio tone."
      >
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="panel p-8">
            <p className="text-sm leading-8 text-slate">
              I work across interface design, front-end systems and full-stack implementation. The goal is simple: make the product look trustworthy because the execution behind it actually is.
            </p>
          </div>
          <div className="panel-muted p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Process</p>
            <ul className="mt-4 space-y-2 text-sm text-sand-2">
              <li>Research and product framing</li>
              <li>UI systems and structured prototyping</li>
              <li>Iterative delivery with implementation feedback</li>
            </ul>
            <Button asChild size="sm" variant="outline" className="mt-6">
              <Link href="/toolkit">View toolkit</Link>
            </Button>
          </div>
        </div>
      </Section>

      <section className="container pb-16">
        <CTA
          title="Want a cleaner, more credible technical presence?"
          description="If the work is strong, the interface should signal that immediately. This site is moving in that direction now."
          actionLabel="Contact me"
          actionHref="/contact"
        />
      </section>
    </div>
  );
}
