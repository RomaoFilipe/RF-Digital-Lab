'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { cn } from '../../../lib/utils';

type MediaAsset = {
  id: string;
  kind: 'IMAGE' | 'VIDEO' | 'FILE';
  path: string;
  originalName: string;
  mime: string;
  size: number;
  width?: number | null;
  height?: number | null;
  createdAt: string;
};

type MediaResponse = {
  items: MediaAsset[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type UploadProgress = {
  name: string;
  progress: number;
};

const TABS = ['all', 'IMAGE', 'VIDEO', 'FILE'] as const;

export default function MediaPage() {
  const [status, setStatus] = useState('');
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [kind, setKind] = useState<typeof TABS[number]>('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [folder, setFolder] = useState<'images' | 'videos' | 'files' | 'covers'>('images');
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [dimensions, setDimensions] = useState<Record<string, string>>({});
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  async function load(overrides?: {
    kind?: typeof TABS[number];
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const params = new URLSearchParams();
    const nextKind = overrides?.kind ?? kind;
    const nextSearch = overrides?.search ?? search;
    const nextDateFrom = overrides?.dateFrom ?? dateFrom;
    const nextDateTo = overrides?.dateTo ?? dateTo;

    if (nextKind !== 'all') params.set('kind', nextKind);
    if (nextSearch) params.set('search', nextSearch);
    if (nextDateFrom) params.set('dateFrom', nextDateFrom);
    if (nextDateTo) params.set('dateTo', nextDateTo);
    const res = await fetch(`${apiBase}/media?${params.toString()}`, { credentials: 'include' });
    const json = (await res.json()) as MediaResponse;
    setMedia(json.items);
  }

  function uploadSingle(file: File) {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      xhr.open('POST', `${apiBase}/media/upload?folder=${folder}`);
      xhr.withCredentials = true;
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploads((prev) => prev.map((entry) => entry.name === file.name ? { ...entry, progress } : entry));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
          return;
        }
        reject(new Error('Upload failed'));
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(formData);
    });
  }

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('');
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const files = Array.from(fileInput.files || []);
    if (!files.length) return;

    setUploads(files.map((file) => ({ name: file.name, progress: 0 })));
    try {
      for (const file of files) {
        await uploadSingle(file);
      }
      setStatus('Upload concluido.');
      setUploads([]);
      form.reset();
      load();
    } catch {
      setStatus('Erro ao fazer upload.');
    }
  }

  async function remove(id: string) {
    await fetch(`${apiBase}/media/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    load();
  }

  async function copy(text: string, success: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(success);
    } catch {
      setStatus('Nao foi possivel copiar.');
    }
  }

  useEffect(() => {
    load();
  }, [kind]);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Media</p>
        <h1 className="font-display text-4xl text-white">Asset library</h1>
        <p className="mt-2 text-sm text-slate">Batch uploads, filtering, dimensions and fast copy actions for local assets.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab}
            type="button"
            size="sm"
            variant={kind === tab ? 'default' : 'outline'}
            onClick={() => setKind(tab)}
          >
            {tab === 'all' ? 'Todas' : tab}
          </Button>
        ))}
      </div>

      <Card className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar media" />
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value as 'images' | 'videos' | 'files' | 'covers')}
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-sand-2"
          >
            <option value="images">images</option>
            <option value="videos">videos</option>
            <option value="files">files</option>
            <option value="covers">covers</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => { void load(); }}>
            Apply filters
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setSearch('');
              setDateFrom('');
              setDateTo('');
              setKind('all');
              load({ kind: 'all', search: '', dateFrom: '', dateTo: '' });
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      <Card>
        <form onSubmit={onUpload} className="space-y-4">
          <input type="file" className="block" multiple />
          <Button type="submit" size="sm">Batch upload</Button>
        </form>
      </Card>

      {uploads.length ? (
        <Card className="space-y-3">
          {uploads.map((upload) => (
            <div key={upload.name}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate">
                <span className="truncate">{upload.name}</span>
                <span>{upload.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-sand-2">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${upload.progress}%` }} />
              </div>
            </div>
          ))}
        </Card>
      ) : null}

      {status && <p className="text-sm text-slate">{status}</p>}

      {media.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {media.map((item) => {
            const publicUrl = `${apiBase}${item.path}`;
            const markdownImage = `![${item.originalName}](${publicUrl})`;
            return (
              <Card key={item.id} className="space-y-3">
                {item.kind === 'IMAGE' ? (
                  <img
                    src={publicUrl}
                    alt={item.originalName}
                    className="h-40 w-full rounded-lg object-cover"
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      setDimensions((prev) => ({
                        ...prev,
                        [item.id]: `${img.naturalWidth}x${img.naturalHeight}`,
                      }));
                    }}
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-white/10 bg-[#0b1220] text-xs text-slate">
                    {item.kind}
                  </div>
                )}
                <div className="text-xs text-slate">
                  <p className="truncate">{item.originalName}</p>
                  <p>{item.kind}</p>
                  <p>{dimensions[item.id] || (item.width && item.height ? `${item.width}x${item.height}` : 'Dimensoes n/d')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => remove(item.id)}>
                    Delete
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => copy(publicUrl, 'URL copiado.')}>
                    Copy URL
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copy(markdownImage, 'Markdown image copiado.')}
                    className={cn('text-xs')}
                  >
                    Copy Markdown
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="space-y-2">
          <h3 className="font-display text-xl text-white">No assets yet</h3>
          <p className="text-sm text-slate">Upload images, videos or files to populate the local media library.</p>
        </Card>
      )}
    </div>
  );
}
