import { renderMarkdown } from '../../lib/markdown';

type CaseStudyData = {
  hasCaseStudy: boolean;
  challengeHtml: string;
  processHtml: string;
  resultHtml: string;
  restHtml?: string | null;
};

type Props = {
  markdown: string;
  caseStudy: CaseStudyData;
};

export function ProjectOverview({ markdown, caseStudy }: Props) {
  if (caseStudy.hasCaseStudy) {
    return (
      <div className="space-y-8">
        <section className="panel p-8">
          <h2 className="font-display text-2xl">Challenge</h2>
          <article className="markdown text-wrap-anywhere mt-4" dangerouslySetInnerHTML={{ __html: caseStudy.challengeHtml }} />
        </section>
        <section className="panel p-8">
          <h2 className="font-display text-2xl">Process</h2>
          <article className="markdown text-wrap-anywhere mt-4" dangerouslySetInnerHTML={{ __html: caseStudy.processHtml }} />
        </section>
        <section className="panel p-8">
          <h2 className="font-display text-2xl">Result</h2>
          <article className="markdown text-wrap-anywhere mt-4" dangerouslySetInnerHTML={{ __html: caseStudy.resultHtml }} />
        </section>
        {caseStudy.restHtml ? (
          <section className="panel p-8">
            <h2 className="font-display text-2xl">Additional notes</h2>
            <article className="markdown text-wrap-anywhere mt-4" dangerouslySetInnerHTML={{ __html: caseStudy.restHtml }} />
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <section className="panel p-8">
      <h2 className="font-display text-2xl">Project overview</h2>
      <article className="markdown text-wrap-anywhere mt-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown || '') }} />
    </section>
  );
}
