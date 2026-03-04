import { ToolkitSection } from './types';

export const toolkitContent: ToolkitSection[] = [
  {
    title: 'Stack',
    items: [
      { name: 'Next.js', description: 'App Router para páginas editoriais e dashboards.' },
      { name: 'NestJS', description: 'API estruturada para auth, conteúdo e media.' },
      { name: 'Prisma + PostgreSQL', description: 'Modelação simples, tipada e previsível.' },
    ],
  },
  {
    title: 'Design Tools',
    items: [
      { name: 'Figma', description: 'Exploração, systems e protótipos.', link: 'https://figma.com' },
      { name: 'After Effects', description: 'Motion curto para identidade e interface.' },
      { name: 'Photoshop', description: 'Composição visual e preparação de assets.' },
    ],
  },
  {
    title: 'Equipment',
    items: [
      { name: 'MacBook Pro', description: 'Base principal de design e desenvolvimento.' },
      { name: 'Monitor 4K', description: 'Espaço confortável para layout e revisão.' },
      { name: 'Mirrorless camera', description: 'Captação de vídeo e material de apoio.' },
    ],
  },
  {
    title: 'Plugins & Presets',
    items: [
      { name: 'Figma plugins', description: 'Tokens, grids e checks rápidos de consistência.' },
      { name: 'Color presets', description: 'Paletas editoriais preparadas para web e vídeo.' },
      { name: 'Type scales', description: 'Escalas tipográficas repetíveis para páginas longas.' },
    ],
  },
];
