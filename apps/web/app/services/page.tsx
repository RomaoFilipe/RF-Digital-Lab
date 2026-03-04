import Link from 'next/link';
import { CTA } from '../../components/CTA';
import { PageHero } from '../../components/PageHero';
import { ServiceCard } from '../../components/ServiceCard';
import { TestimonialsCarousel } from '../../components/TestimonialsCarousel';
import { Button } from '../../components/ui/button';
import { servicesContent } from '../../lib/content/services';
import { testimonialsContent } from '../../lib/content/testimonials';

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        kicker="Services"
        title="Structured services for product-facing work"
        description="I step in where interface quality, system thinking and implementation need to align. The output should feel product-grade, not improvised."
      />

      <section className="container pb-10">
        <div className="grid gap-6 md:grid-cols-3">
          {servicesContent.map((service) => (
            <ServiceCard key={service.title} item={service} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="sm">
            <Link href="/contact">Request a proposal</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/toolkit">View toolkit</Link>
          </Button>
        </div>
      </section>

      <section className="container py-12">
        <TestimonialsCarousel items={testimonialsContent.slice(0, 2)} />
      </section>

      <section className="container py-16">
        <CTA
          title="Need direct collaboration with clear scope?"
          description="If the problem is already defined, we can move fast. If not, the first step is framing it properly."
          actionLabel="Contact"
          actionHref="/contact"
        />
      </section>
    </div>
  );
}
