import { Section } from '../../components/Section';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div>
      <Section
        kicker="Contact"
        title="Let’s talk about the next build"
        subtitle="Share the problem, the timeline and the context. I’ll reply with a practical collaboration proposal."
      >
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Email</p>
              <p className="mt-2 text-lg text-white">hello@portf.local</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Location</p>
              <p className="mt-2 text-lg text-white">Lisbon · Remote</p>
            </div>
            <Button asChild size="sm">
              <Link href="mailto:hello@portf.local">Send email</Link>
            </Button>
          </Card>
          <Card className="space-y-3 border-accent/20 bg-[#08111f]">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Availability</p>
            <p className="text-2xl font-display text-white">Open for new projects and redesign work.</p>
            <p className="text-sm leading-7 text-slate">Product UI, developer portfolios, admin systems and technical front-end implementation.</p>
          </Card>
        </div>
      </Section>
    </div>
  );
}
