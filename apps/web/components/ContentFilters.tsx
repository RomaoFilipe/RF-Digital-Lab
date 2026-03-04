'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';

const TYPES = [
  { label: 'All', value: 'all' },
  { label: 'Video', value: 'video' },
  { label: 'Imagem', value: 'image' },
  { label: 'Edição', value: 'editing' },
  { label: 'Dev', value: 'dev' },
  { label: '3D', value: '3d' },
  { label: 'Artigo', value: 'article' },
  { label: 'Publicação', value: 'publication' },
  { label: 'Outro', value: 'other' },
];

export function ContentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete('page');
    const qs = next.toString();
    router.push(qs ? `/dashboard/content?${qs}` : '/dashboard/content');
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-6">
        <Input
          placeholder="Search"
          defaultValue={searchParams.get('search') ?? ''}
          onBlur={(e) => setParam('search', e.target.value || null)}
        />
        <Input
          placeholder="Tags (csv)"
          defaultValue={searchParams.get('tags') ?? ''}
          onBlur={(e) => setParam('tags', e.target.value || null)}
        />
        <Input
          placeholder="Ano"
          type="number"
          defaultValue={searchParams.get('year') ?? ''}
          onBlur={(e) => setParam('year', e.target.value || null)}
        />
        <Select
          defaultValue={searchParams.get('status') ?? 'all'}
          onChange={(e) => setParam('status', e.target.value)}
        >
          <option value="all">Status: All</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </Select>
        <Select
          defaultValue={searchParams.get('tab') ?? 'all'}
          onChange={(e) => setParam('tab', e.target.value)}
        >
          {TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
        <Select
          defaultValue={searchParams.get('limit') ?? '12'}
          onChange={(e) => setParam('limit', e.target.value)}
        >
          <option value="6">6 / página</option>
          <option value="12">12 / página</option>
          <option value="24">24 / página</option>
          <option value="48">48 / página</option>
        </Select>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('featured') === 'true'}
            onChange={(e) => setParam('featured', e.target.checked ? 'true' : null)}
          />
          Featured
        </label>
        <Button type="button" variant="outline" size="sm" onClick={() => router.push('/dashboard/content')}>
          Limpar
        </Button>
      </div>
    </div>
  );
}
