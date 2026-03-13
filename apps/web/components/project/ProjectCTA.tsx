import Link from 'next/link';
import { Button } from '../ui/button';

export function ProjectCTA() {
  return (
    <section className="rounded-2xl border border-accent/20 bg-[#08111f] p-6">
      <h3 className="font-display text-xl text-white">Need something similar?</h3>
      <p className="mt-3 text-sm leading-7 text-slate">
        I can design and implement a complete technical product with frontend, admin dashboard and API.
      </p>
      <Button asChild size="sm" className="mt-4">
        <Link href="/contact">Start a project</Link>
      </Button>
    </section>
  );
}
