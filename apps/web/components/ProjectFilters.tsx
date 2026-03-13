'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Badge } from './ui/badge';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Video', value: 'video' },
  { label: 'Imagem', value: 'image' },
  { label: 'Edição', value: 'editing' },
  { label: 'Dev', value: 'dev' },
  { label: '3D', value: '3d' },
  { label: 'Artigos', value: 'article' },
  { label: 'Publicações', value: 'publication' },
  { label: 'Outros', value: 'other' },
];

export function ProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const currentTab = params.get('tab') ?? 'all';

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete('page');
    const qs = next.toString();
    router.push(qs ? `/projects?${qs}` : '/projects');
  }

  function removeTag(tag: string) {
    const tags = (params.get('tags') || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => t !== tag);
    setParam('tags', tags.length ? tags.join(',') : null);
  }

  const activeTags = (params.get('tags') || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const activeTech = (params.get('tech') || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const activeFilters = [
    params.get('search') ? { label: `Search: ${params.get('search')}`, key: 'search' } : null,
    params.get('year') ? { label: `Ano: ${params.get('year')}`, key: 'year' } : null,
    params.get('featured') === 'true' ? { label: 'Featured', key: 'featured' } : null,
    params.get('sort') && params.get('sort') !== 'newest'
      ? { label: `Sort: ${params.get('sort')}`, key: 'sort' }
      : null,
  ].filter(Boolean) as { label: string; key: string }[];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-soft">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            onClick={() => setParam('tab', tab.value)}
            variant={currentTab === tab.value ? 'default' : 'soft'}
            size="sm"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-6">
        <Input
          placeholder="Search"
          defaultValue={params.get('search') ?? ''}
          onBlur={(e) => setParam('search', e.target.value || null)}
        />
        <Input
          placeholder="Tech (csv)"
          defaultValue={params.get('tech') ?? ''}
          onBlur={(e) => setParam('tech', e.target.value || null)}
        />
        <Input
          placeholder="Tags (csv)"
          defaultValue={params.get('tags') ?? ''}
          onBlur={(e) => setParam('tags', e.target.value || null)}
        />
        <Input
          placeholder="Ano"
          type="number"
          defaultValue={params.get('year') ?? ''}
          onBlur={(e) => setParam('year', e.target.value || null)}
        />
        <Select
          defaultValue={params.get('sort') ?? 'newest'}
          onChange={(e) => setParam('sort', e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="featured">Featured</option>
        </Select>
        <label className="flex items-center gap-2 text-sm text-slate">
          <input
            type="checkbox"
            defaultChecked={params.get('featured') === 'true'}
            onChange={(e) => setParam('featured', e.target.checked ? 'true' : null)}
          />
          Featured only
        </label>
      </div>

      {(activeTags.length || activeTech.length || activeFilters.length || currentTab !== 'all') && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {currentTab !== 'all' && (
            <Badge variant="outline" className="flex items-center gap-2">
              {currentTab}
              <button type="button" onClick={() => setParam('tab', 'all')} className="text-[10px]">×</button>
            </Badge>
          )}
          {activeTags.map((tag) => (
            <Badge key={tag} variant="outline" className="flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-[10px]">×</button>
            </Badge>
          ))}
          {activeTech.map((tech) => (
            <Badge key={`tech-${tech}`} variant="outline" className="flex items-center gap-2">
              tech:{tech}
              <button
                type="button"
                onClick={() => {
                  const nextTech = activeTech.filter((item) => item !== tech);
                  setParam('tech', nextTech.length ? nextTech.join(',') : null);
                }}
                className="text-[10px]"
              >
                ×
              </button>
            </Badge>
          ))}
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="outline" className="flex items-center gap-2">
              {filter.label}
              <button type="button" onClick={() => setParam(filter.key, null)} className="text-[10px]">×</button>
            </Badge>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => router.push('/projects')}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
