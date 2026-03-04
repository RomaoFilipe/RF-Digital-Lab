import { ServiceItem } from './types';

export const servicesContent: ServiceItem[] = [
  {
    title: 'Design de produto editorial',
    summary:
      'Estruturo interfaces, landing pages e sistemas visuais com hierarquia forte e leitura clara.',
    deliverables: ['Direção visual', 'Wireframes', 'UI final', 'Design QA'],
    timeline: '2 a 4 semanas',
    engagementModel: 'Projeto fechado ou sprint intensivo',
  },
  {
    title: 'Front-end para experiências digitais',
    summary:
      'Implementação em Next.js com foco em performance, narrativa visual e componentes reutilizáveis.',
    deliverables: ['Arquitetura UI', 'Implementação front-end', 'Motion subtil', 'Hand-off técnico'],
    timeline: '3 a 6 semanas',
    engagementModel: 'Projeto ou retainer curto',
  },
  {
    title: 'Case studies e storytelling visual',
    summary:
      'Transformo trabalho disperso em páginas que explicam contexto, processo e resultado com clareza.',
    deliverables: ['Estrutura narrativa', 'Copy support', 'Layout editorial', 'Assets guidance'],
    timeline: '1 a 3 semanas',
    engagementModel: 'Pacote específico de conteúdo',
  },
];
