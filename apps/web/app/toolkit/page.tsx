import { CTA } from '../../components/CTA';
import { PageHero } from '../../components/PageHero';
import { ToolkitGrid } from '../../components/ToolkitGrid';
import { toolkitContent } from '../../lib/content/toolkit';

export default function ToolkitPage() {
  return (
    <div>
      <PageHero
        kicker="Toolkit"
        title="Stack, tools and working references"
        description="The toolkit behind the work: engineering stack, design tools, workflow references and execution helpers."
      />

      <section className="container pb-10">
        <ToolkitGrid sections={toolkitContent} />
      </section>

      <section className="container py-16">
        <CTA
          title="Tools only matter when they improve execution"
          description="The stack exists to support clarity, speed and consistency. The problem still comes first."
          actionLabel="View services"
          actionHref="/services"
        />
      </section>
    </div>
  );
}
