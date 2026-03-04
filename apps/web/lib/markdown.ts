import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'blockquote',
  'code',
  'pre',
  'hr',
  'br',
];

const allowedAttributes = {
  a: ['href', 'name', 'target', 'rel'],
  code: ['class'],
};

export function renderMarkdown(markdown: string) {
  const html = marked.parse(markdown || '', { breaks: true }) as string;
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noreferrer noopener', target: '_blank' }),
    },
  });
}
