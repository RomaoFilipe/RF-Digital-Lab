'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ContentItem } from '../lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type Props = {
  items: ContentItem[];
};

export function DashboardContentTable({ items }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function patchStatus(id: string, status: 'PUBLISHED' | 'ARCHIVED') {
    setBusyId(id);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      await fetch(`${base}/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      window.location.reload();
    } finally {
      setBusyId(null);
    }
  }

  async function duplicate(id: string) {
    setBusyId(id);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const res = await fetch(`${base}/content/${id}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json();
      window.location.href = `/dashboard/content/${json.id}`;
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="grid grid-cols-[1fr_120px_120px_220px] gap-4 border-b border-white/10 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-slate">
        <span>Título</span>
        <span>Status</span>
        <span>Tipo</span>
        <span>Ações</span>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[1fr_120px_120px_220px] gap-4 border-b border-white/10 px-6 py-4 text-sm text-sand-2 last:border-b-0"
        >
          <span className="flex items-center gap-2">
            {item.title}
            {item.featured ? <Badge variant="default">Featured</Badge> : null}
          </span>
          <span>{item.status}</span>
          <span>{item.type}</span>
          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/content/${item.id}`} className="text-accent">
              Editar
            </Link>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busyId === item.id || item.status === 'PUBLISHED'}
              onClick={() => patchStatus(item.id, 'PUBLISHED')}
            >
              Publicar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busyId === item.id || item.status === 'ARCHIVED'}
              onClick={() => patchStatus(item.id, 'ARCHIVED')}
            >
              Arquivar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busyId === item.id}
              onClick={() => duplicate(item.id)}
            >
              Duplicar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
