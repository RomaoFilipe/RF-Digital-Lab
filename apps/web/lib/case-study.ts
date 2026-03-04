import { renderMarkdown } from './markdown';

type CaseStudySections = {
  hasCaseStudy: boolean;
  challengeHtml: string;
  processHtml: string;
  resultHtml: string;
  restHtml: string;
};

function extractSection(markdown: string, heading: string) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `(?:^|\\n)##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`,
    'i',
  );
  const match = markdown.match(regex);
  return match ? match[1].trim() : '';
}

export function parseCaseStudySections(markdown: string): CaseStudySections {
  const source = markdown || '';
  const challenge = extractSection(source, 'Desafio');
  const process = extractSection(source, 'Processo');
  const result = extractSection(source, 'Resultado');

  if (!challenge || !process || !result) {
    return {
      hasCaseStudy: false,
      challengeHtml: '',
      processHtml: '',
      resultHtml: '',
      restHtml: renderMarkdown(source),
    };
  }

  const rest = source
    .replace(/(?:^|\n)##\s+Desafio\s*\n[\s\S]*?(?=\n##\s+|$)/i, '\n')
    .replace(/(?:^|\n)##\s+Processo\s*\n[\s\S]*?(?=\n##\s+|$)/i, '\n')
    .replace(/(?:^|\n)##\s+Resultado\s*\n[\s\S]*?(?=\n##\s+|$)/i, '\n')
    .trim();

  return {
    hasCaseStudy: true,
    challengeHtml: renderMarkdown(challenge),
    processHtml: renderMarkdown(process),
    resultHtml: renderMarkdown(result),
    restHtml: rest ? renderMarkdown(rest) : '',
  };
}
