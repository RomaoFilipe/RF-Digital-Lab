'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ page, totalPages, basePath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(nextPage));
    }
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <div className="flex items-center justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Anterior
      </Button>
      <span className="text-sm text-slate">
        Página {page} de {Math.max(totalPages, 1)}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Seguinte
      </Button>
    </div>
  );
}
