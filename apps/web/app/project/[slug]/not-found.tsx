import Link from 'next/link';
import { Button } from '../../../components/ui/button';

export default function ProjectNotFound() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#0a1120] p-8 text-center shadow-lift">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl text-white">Projeto não encontrado</h1>
        <p className="mt-4 text-sm leading-7 text-slate">
          Este slug não existe ou o conteúdo ainda não está publicado.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild size="sm">
            <Link href="/projects">Ver projetos publicados</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
