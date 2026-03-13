'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentItem, MediaAsset, ShowcaseItem } from '../lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { Card } from './ui/card';
import { makeSlug } from '../lib/slug';
import { renderMarkdown } from '../lib/markdown';

const schema = z.object({
  title: z.string().min(1),
  type: z.enum(['VIDEO', 'IMAGE', 'EDITING', 'DEV', 'THREE_D', 'ARTICLE', 'PUBLICATION', 'OTHER']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  slug: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  featured: z.boolean().optional(),
  year: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(1900).optional(),
  ),
  tags: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  repoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  stack: z.string().optional(),
  highlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  vimeoUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  videoProvider: z.enum(['YOUTUBE', 'VIMEO', 'LOCAL', 'NONE']).default('NONE'),
  teamSize: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(1).optional(),
  ),
  developmentTimeDays: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(1).optional(),
  ),
  challengesText: z.string().optional(),
  learningsText: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type NamedItem = { name: string; slug: string; icon?: string };
type FeatureItem = { name: string; icon?: string; description?: string };
type ArchitectureItem = { layer: string; value: string; notes?: string };
type StatItem = { label: string; value: string; unit?: string; source?: string };
type LinkItem = { label: string; url: string };

type ShowcaseDraft = {
  technologies: NamedItem[];
  tools: NamedItem[];
  software: NamedItem[];
  features: FeatureItem[];
  architecture: ArchitectureItem[];
  stats: StatItem[];
  links: LinkItem[];
  videoAsset: MediaAsset | null;
};

type Snapshot = {
  id: string;
  label: string;
  savedAt: string;
  values: FormData;
  cover: MediaAsset | null;
  gallery: MediaAsset[];
  showcase: ShowcaseDraft;
};

type Props = {
  mode: 'create' | 'edit';
  initial?: ContentItem | null;
};

function normalizeNamed(items?: ShowcaseItem[] | null): NamedItem[] {
  return (items || [])
    .map((item) => ({
      name: item.name,
      slug: makeSlug(item.slug || item.name),
      icon: item.icon || undefined,
    }))
    .filter((item) => item.name && item.slug);
}

function parseLines(value?: string) {
  return (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function emptyShowcase(initial?: ContentItem | null): ShowcaseDraft {
  return {
    technologies: normalizeNamed(initial?.showcase?.technologies),
    tools: normalizeNamed(initial?.showcase?.tools),
    software: normalizeNamed(initial?.showcase?.software),
    features:
      initial?.showcase?.features?.map((item) => ({
        name: item.name,
        icon: item.icon || undefined,
        description: item.description || undefined,
      })) || [],
    architecture:
      initial?.showcase?.architecture?.map((item) => ({
        layer: item.layer,
        value: item.value,
        notes: item.notes || undefined,
      })) || [],
    stats:
      initial?.showcase?.stats?.map((item) => ({
        label: item.label,
        value: item.value,
        unit: item.unit || undefined,
        source: item.source || undefined,
      })) || [],
    links:
      initial?.showcase?.links?.map((item) => ({
        label: item.label,
        url: item.url,
      })) || [],
    videoAsset: initial?.showcase?.videoAsset || null,
  };
}

function sanitizeShowcaseDraft(value?: Partial<ShowcaseDraft> | null): ShowcaseDraft {
  return {
    technologies: value?.technologies ?? [],
    tools: value?.tools ?? [],
    software: value?.software ?? [],
    features: value?.features ?? [],
    architecture: value?.architecture ?? [],
    stats: value?.stats ?? [],
    links: value?.links ?? [],
    videoAsset: value?.videoAsset ?? null,
  };
}

export function ContentForm({ mode, initial }: Props) {
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cover, setCover] = useState<MediaAsset | null>(initial?.coverMedia ?? null);
  const [gallery, setGallery] = useState<MediaAsset[]>(initial?.gallery?.map((item) => item.media) ?? []);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [showcase, setShowcase] = useState<ShowcaseDraft>(() => sanitizeShowcaseDraft(emptyShowcase(initial)));
  const [slugState, setSlugState] = useState<{ checking: boolean; available: boolean | null; normalized: string }>({
    checking: false,
    available: null,
    normalized: '',
  });
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [techDraft, setTechDraft] = useState('');
  const [toolDraft, setToolDraft] = useState('');
  const [softwareDraft, setSoftwareDraft] = useState('');

  const { register, handleSubmit, formState, watch, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          type: initial.type,
          status: initial.status,
          slug: initial.slug,
          summary: initial.summary ?? '',
          content: initial.content ?? '',
          featured: initial.featured,
          year: initial.year ?? undefined,
          tags: initial.tags?.map((t) => t.tag.slug).join(',') ?? '',
          seoTitle: initial.seoTitle ?? '',
          seoDescription: initial.seoDescription ?? '',
          seoKeywords: initial.seoKeywords ?? '',
          repoUrl: initial.devDetails?.repoUrl ?? '',
          liveUrl: initial.devDetails?.liveUrl ?? '',
          stack: initial.devDetails?.stack ?? '',
          highlights: initial.devDetails?.highlights ?? '',
          youtubeUrl: initial.videoDetails?.youtubeUrl ?? '',
          vimeoUrl: initial.videoDetails?.vimeoUrl ?? '',
          demoUrl: initial.showcase?.demoUrl ?? '',
          videoUrl: initial.showcase?.videoUrl ?? '',
          videoProvider: initial.showcase?.videoProvider ?? 'NONE',
          teamSize: initial.showcase?.teamSize ?? undefined,
          developmentTimeDays: initial.showcase?.developmentTimeDays ?? undefined,
          challengesText: (initial.showcase?.challenges || []).join('\n'),
          learningsText: (initial.showcase?.learnings || []).join('\n'),
        }
      : {
          type: 'DEV',
          status: 'DRAFT',
          videoProvider: 'NONE',
        },
  });

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const watched = watch();
  const draftKey = `portf-content-draft-${initial?.id ?? 'new'}`;
  const snapshotsKey = `portf-content-snapshots-${initial?.id ?? 'new'}`;
  const slugPreview = makeSlug(watched.slug?.trim() || watched.title || '');

  useEffect(() => {
    const rawDraft = localStorage.getItem(draftKey);
    const rawSnapshots = localStorage.getItem(snapshotsKey);
    if (rawSnapshots) {
      try {
        setSnapshots(JSON.parse(rawSnapshots) as Snapshot[]);
      } catch {
        setSnapshots([]);
      }
    }
    if (rawDraft) {
      try {
        const parsed = JSON.parse(rawDraft) as Snapshot;
        reset(parsed.values);
        setCover(parsed.cover);
        setGallery(parsed.gallery);
        setShowcase(sanitizeShowcaseDraft(parsed.showcase || emptyShowcase(initial)));
        setStatus('Rascunho local restaurado.');
      } catch {
        // ignore corrupt local draft
      }
    }
  }, [draftKey, snapshotsKey, reset, initial]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const snapshot: Snapshot = {
        id: `draft-${initial?.id ?? 'new'}`,
        label: watched.title || 'Draft',
        savedAt: new Date().toISOString(),
        values: watched,
        cover,
        gallery,
        showcase,
      };
      localStorage.setItem(draftKey, JSON.stringify(snapshot));
    }, 500);
    return () => window.clearTimeout(timer);
  }, [watched, cover, gallery, showcase, draftKey, initial?.id]);

  useEffect(() => {
    if (!slugPreview) {
      setSlugState({ checking: false, available: null, normalized: '' });
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        setSlugState((prev) => ({ ...prev, checking: true, normalized: slugPreview }));
        const params = new URLSearchParams({ slug: slugPreview });
        if (initial?.id) params.set('ignoreId', initial.id);
        const res = await fetch(`${apiBase}/content/admin/slug-availability/check?${params.toString()}`, {
          credentials: 'include',
        });
        const json = await res.json();
        setSlugState({ checking: false, available: json.available, normalized: json.slug });
      } catch {
        setSlugState({ checking: false, available: null, normalized: slugPreview });
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [slugPreview, initial?.id, apiBase]);

  async function uploadFile(file: File, folder: 'images' | 'videos' | 'files' | 'covers') {
    const data = new FormData();
    data.append('file', file);
    const res = await fetch(`${apiBase}/media/upload?folder=${folder}`, {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
    if (!res.ok) throw new Error('Upload failed');
    return (await res.json()) as MediaAsset;
  }

  function persistSnapshots(nextSnapshots: Snapshot[]) {
    setSnapshots(nextSnapshots);
    localStorage.setItem(snapshotsKey, JSON.stringify(nextSnapshots));
  }

  function saveSnapshot() {
    const next: Snapshot = {
      id: `${Date.now()}`,
      label: watched.title || 'Sem titulo',
      savedAt: new Date().toISOString(),
      values: watched,
      cover,
      gallery,
      showcase,
    };
    const updated = [next, ...snapshots].slice(0, 8);
    persistSnapshots(updated);
    setStatus('Snapshot guardado localmente.');
  }

  function restoreSnapshot(snapshot: Snapshot) {
    reset(snapshot.values);
    setCover(snapshot.cover);
    setGallery(snapshot.gallery);
    setShowcase(sanitizeShowcaseDraft(snapshot.showcase || emptyShowcase(initial)));
    setStatus(`Snapshot restaurado: ${snapshot.label}`);
  }

  function clearLocalDraft() {
    localStorage.removeItem(draftKey);
    setStatus('Rascunho local limpo.');
  }

  async function duplicateCurrent() {
    if (!initial?.id) return;
    const res = await fetch(`${apiBase}/content/${initial.id}/duplicate`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      setError('Erro ao duplicar conteúdo');
      return;
    }
    const json = await res.json();
    window.location.href = `/dashboard/content/${json.id}`;
  }

  function addNamedItem(kind: 'technologies' | 'tools' | 'software', raw: string) {
    const name = raw.trim();
    const slug = makeSlug(name);
    if (!name || !slug) return;
    setShowcase((prev) => {
      const exists = prev[kind].some((item) => item.slug === slug);
      if (exists) return prev;
      return {
        ...prev,
        [kind]: [...prev[kind], { name, slug }],
      };
    });
  }

  function buildShowcasePayload(data: FormData) {
    const technologies = showcase.technologies.map((item) => ({ name: item.name, slug: item.slug, icon: item.icon }));
    const tools = showcase.tools.map((item) => ({ name: item.name, slug: item.slug, icon: item.icon }));
    const software = showcase.software.map((item) => ({ name: item.name, slug: item.slug, icon: item.icon }));
    const features = showcase.features
      .filter((item) => item.name.trim())
      .map((item) => ({
        name: item.name.trim(),
        icon: item.icon?.trim() || undefined,
        description: item.description?.trim() || undefined,
      }));
    const architecture = showcase.architecture
      .filter((item) => item.layer.trim() && item.value.trim())
      .map((item) => ({
        layer: item.layer.trim(),
        value: item.value.trim(),
        notes: item.notes?.trim() || undefined,
      }));
    const stats = showcase.stats
      .filter((item) => item.label.trim() && item.value.trim())
      .map((item) => ({
        label: item.label.trim(),
        value: item.value.trim(),
        unit: item.unit?.trim() || undefined,
        source: item.source?.trim() || undefined,
      }));
    const links = showcase.links
      .filter((item) => item.label.trim() && item.url.trim())
      .map((item) => ({
        label: item.label.trim(),
        url: item.url.trim(),
      }));

    return {
      technologies,
      tools,
      software,
      features,
      architecture,
      stats,
      links,
      challenges: parseLines(data.challengesText),
      learnings: parseLines(data.learningsText),
      demoUrl: data.demoUrl?.trim() || undefined,
      videoUrl:
        data.videoProvider === 'LOCAL'
          ? showcase.videoAsset?.path || data.videoUrl?.trim() || undefined
          : data.videoUrl?.trim() || undefined,
      videoProvider: data.videoProvider,
      videoAssetId: showcase.videoAsset?.id || undefined,
      teamSize: data.teamSize || undefined,
      developmentTimeDays: data.developmentTimeDays || undefined,
    };
  }

  async function onSubmit(data: FormData) {
    setError('');
    const tagSlugs = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined;

    const payload: Record<string, any> = {
      ...data,
      slug: slugPreview || undefined,
      tagSlugs,
      coverMediaId: cover ? cover.id : mode === 'edit' ? null : undefined,
      galleryIds: gallery.map((item) => item.id),
    };
    if (!payload.slug) delete payload.slug;
    if (payload.coverMediaId === undefined) delete payload.coverMediaId;
    if (!payload.tags) delete payload.tags;

    const res = await fetch(`${apiBase}/content${mode === 'edit' ? `/${initial?.id}` : ''}`, {
      method: mode === 'edit' ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError('Erro ao guardar conteúdo');
      return;
    }

    const saved = (await res.json()) as ContentItem;
    const contentId = saved.id || initial?.id;
    if (!contentId) {
      setError('Erro ao guardar showcase');
      return;
    }

    const showcasePayload = buildShowcasePayload(data);
    const showcaseRes = await fetch(`${apiBase}/content/${contentId}/showcase`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(showcasePayload),
    });

    if (!showcaseRes.ok) {
      setError('Conteúdo guardado, mas houve erro ao guardar a secção Showcase.');
      return;
    }

    localStorage.removeItem(draftKey);
    window.location.href = '/dashboard/content';
  }

  const seoChecklist = [
    { label: 'SEO title com 30-60 caracteres', ok: (watched.seoTitle || '').length >= 30 && (watched.seoTitle || '').length <= 60 },
    { label: 'SEO description com 70-160 caracteres', ok: (watched.seoDescription || '').length >= 70 && (watched.seoDescription || '').length <= 160 },
    { label: 'Tags definidas', ok: Boolean((watched.tags || '').trim()) },
    { label: 'Cover definido', ok: Boolean(cover) },
  ];

  const previewTitle = watched.seoTitle || watched.title || 'Titulo do projeto';
  const previewDescription = watched.seoDescription || watched.summary || 'Descricao curta do conteudo.';
  const publicTags = (watched.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean);
  const publicTech = useMemo(() => showcase.technologies.slice(0, 3), [showcase.technologies]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid min-w-0 max-w-full gap-6 overflow-x-hidden">
      <Card className="min-w-0 space-y-4 md:p-7 xl:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Base</p>
            <h3 className="font-display text-xl text-white">Core content fields</h3>
            <p className="text-sm text-slate">Public identity, content type, summary and slug management.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={saveSnapshot}>
              Guardar snapshot
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={clearLocalDraft}>
              Limpar draft
            </Button>
            {mode === 'edit' ? (
              <Button type="button" variant="outline" size="sm" onClick={duplicateCurrent}>
                Duplicar
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm">Titulo</label>
          <Input {...register('title')} />
        </div>

        <div className="grid min-w-0 gap-2 md:grid-cols-3">
          <div>
            <label className="text-sm">Tipo</label>
            <Select className="mt-1" {...register('type')}>
              <option value="VIDEO">VIDEO</option>
              <option value="IMAGE">IMAGE</option>
              <option value="EDITING">EDITING</option>
              <option value="DEV">DEV</option>
              <option value="THREE_D">THREE_D</option>
              <option value="ARTICLE">ARTICLE</option>
              <option value="PUBLICATION">PUBLICATION</option>
              <option value="OTHER">OTHER</option>
            </Select>
          </div>
          <div>
            <label className="text-sm">Status</label>
            <Select className="mt-1" {...register('status')}>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </Select>
          </div>
          <div>
            <label className="text-sm">Ano</label>
            <Input type="number" className="mt-1" {...register('year')} />
          </div>
        </div>

        <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <label className="text-sm">Slug</label>
            <Input {...register('slug')} placeholder="deixa vazio para gerar a partir do titulo" />
            <div className="mt-2 flex flex-wrap items-center gap-3 break-all font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
              <span>Preview: /project/{slugState.normalized || slugPreview || 'slug'}</span>
              {slugState.checking ? <span>A validar...</span> : null}
              {slugState.available === true ? <span className="text-success">Disponivel</span> : null}
              {slugState.available === false ? <span className="text-red-600">Ja existe</span> : null}
            </div>
          </div>
          <div className="self-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setValue('slug', makeSlug(watched.title || ''))}>
              Gerar slug
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm">Resumo</label>
          <Textarea rows={3} {...register('summary')} />
        </div>

        <div className="grid gap-2">
          <label className="text-sm">Conteudo (markdown)</label>
          <Textarea rows={10} {...register('content')} />
        </div>

        <div className="grid gap-2">
          <label className="text-sm">Tags (csv)</label>
          <Input {...register('tags')} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('featured')} />
          Featured
        </label>
      </Card>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Card className="min-w-0 space-y-4 md:p-7 xl:p-8">
          <div>
            <p className="eyebrow">SEO</p>
            <h3 className="font-display text-xl text-white">Search and social preview</h3>
            <p className="text-sm text-slate">Checklist, search snippet and OpenGraph preview in one panel.</p>
          </div>
          <Input placeholder="SEO Title" {...register('seoTitle')} />
          <Textarea placeholder="SEO Description" rows={3} {...register('seoDescription')} />
          <Input placeholder="SEO Keywords (csv)" {...register('seoKeywords')} />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">SEO checklist</p>
            <div className="mt-3 space-y-2 text-sm">
              {seoChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <span>{item.label}</span>
                  <span className={item.ok ? 'text-success' : 'text-slate'}>{item.ok ? 'OK' : 'Falta'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">Search preview</p>
              <p className="mt-2 break-all text-sm text-success">https://teudominio.pt/project/{slugPreview || 'slug'}</p>
              <p className="mt-1 break-words text-lg text-[#1a0dab]">{previewTitle}</p>
              <p className="mt-1 break-words text-sm text-slate">{previewDescription}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate">OpenGraph</p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                {cover ? (
                  <img src={`${apiBase}${cover.path}`} alt={previewTitle} className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-[#0b1220] text-xs text-slate">Sem cover</div>
                )}
                <div className="p-4">
                  <p className="break-words font-display text-xl text-white">{previewTitle}</p>
                  <p className="mt-2 break-words text-sm text-slate">{previewDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="min-w-0 space-y-4 md:p-7 xl:p-8">
          <div>
            <p className="eyebrow">Public preview</p>
            <h3 className="font-display text-xl text-white">Live card snapshot</h3>
            <p className="text-sm text-slate">Quick public-facing preview before publishing.</p>
          </div>
          {cover ? (
            <img src={`${apiBase}${cover.path}`} alt={watched.title || 'Preview'} className="h-56 w-full rounded-2xl object-cover" />
          ) : null}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-accent/30 bg-accent/12 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              {watched.type || 'DEV'}
            </span>
            {publicTags.map((tag) => (
              <span key={tag} className="rounded-md border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                {tag}
              </span>
            ))}
            {publicTech.map((tech) => (
              <span key={tech.slug} className="rounded-md border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                {tech.name}
              </span>
            ))}
          </div>
          <h3 className="break-words font-display text-3xl text-white">{watched.title || 'Titulo do projeto'}</h3>
          {watched.summary ? <p className="text-wrap-anywhere text-sm leading-7 text-slate">{watched.summary}</p> : null}
          <article className="markdown min-w-0 break-words [&_*]:break-words" dangerouslySetInnerHTML={{ __html: renderMarkdown(watched.content || '') }} />
        </Card>
      </div>

      <Card className="min-w-0 space-y-4 md:p-7 xl:p-8">
        <div>
          <p className="eyebrow">Showcase</p>
          <h3 className="font-display text-xl text-white">Project showcase metadata</h3>
          <p className="text-sm text-slate">Technologies, architecture, stats, links, challenges and learnings.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm">Technologies</label>
            <div className="flex gap-2">
              <Input value={techDraft} onChange={(e) => setTechDraft(e.target.value)} placeholder="Next.js" />
              <Button type="button" variant="outline" size="sm" onClick={() => { addNamedItem('technologies', techDraft); setTechDraft(''); }}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {showcase.technologies.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate"
                  onClick={() => setShowcase((prev) => ({ ...prev, technologies: prev.technologies.filter((entry) => entry.slug !== item.slug) }))}
                >
                  {item.name} ×
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Tools</label>
            <div className="flex gap-2">
              <Input value={toolDraft} onChange={(e) => setToolDraft(e.target.value)} placeholder="Docker" />
              <Button type="button" variant="outline" size="sm" onClick={() => { addNamedItem('tools', toolDraft); setToolDraft(''); }}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {showcase.tools.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate"
                  onClick={() => setShowcase((prev) => ({ ...prev, tools: prev.tools.filter((entry) => entry.slug !== item.slug) }))}
                >
                  {item.name} ×
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Software</label>
            <div className="flex gap-2">
              <Input value={softwareDraft} onChange={(e) => setSoftwareDraft(e.target.value)} placeholder="Figma" />
              <Button type="button" variant="outline" size="sm" onClick={() => { addNamedItem('software', softwareDraft); setSoftwareDraft(''); }}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {showcase.software.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate"
                  onClick={() => setShowcase((prev) => ({ ...prev, software: prev.software.filter((entry) => entry.slug !== item.slug) }))}
                >
                  {item.name} ×
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">Features</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowcase((prev) => ({
                    ...prev,
                    features: [...prev.features, { name: '', icon: 'feature', description: '' }],
                  }))
                }
              >
                Add feature
              </Button>
            </div>
            <div className="space-y-2">
              {showcase.features.map((item, index) => (
                <div key={`feature-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_140px]">
                    <Input
                      value={item.name}
                      placeholder="Feature name"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.features];
                          next[index] = { ...next[index], name: e.target.value };
                          return { ...prev, features: next };
                        })
                      }
                    />
                    <Input
                      value={item.icon || ''}
                      placeholder="Icon key"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.features];
                          next[index] = { ...next[index], icon: e.target.value };
                          return { ...prev, features: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-2 flex items-start gap-2">
                    <Input
                      value={item.description || ''}
                      placeholder="Description"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.features];
                          next[index] = { ...next[index], description: e.target.value };
                          return { ...prev, features: next };
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowcase((prev) => ({
                          ...prev,
                          features: prev.features.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">Architecture</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowcase((prev) => ({
                    ...prev,
                    architecture: [...prev.architecture, { layer: '', value: '', notes: '' }],
                  }))
                }
              >
                Add node
              </Button>
            </div>
            <div className="space-y-2">
              {showcase.architecture.map((item, index) => (
                <div key={`architecture-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(120px,180px)_minmax(0,1fr)]">
                    <Input
                      value={item.layer}
                      placeholder="Layer"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.architecture];
                          next[index] = { ...next[index], layer: e.target.value };
                          return { ...prev, architecture: next };
                        })
                      }
                    />
                    <Input
                      value={item.value}
                      placeholder="Value"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.architecture];
                          next[index] = { ...next[index], value: e.target.value };
                          return { ...prev, architecture: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-2 flex items-start gap-2">
                    <Input
                      value={item.notes || ''}
                      placeholder="Notes"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.architecture];
                          next[index] = { ...next[index], notes: e.target.value };
                          return { ...prev, architecture: next };
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowcase((prev) => ({
                          ...prev,
                          architecture: prev.architecture.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">Stats</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowcase((prev) => ({
                    ...prev,
                    stats: [...prev.stats, { label: '', value: '', unit: '', source: '' }],
                  }))
                }
              >
                Add stat
              </Button>
            </div>
            <div className="space-y-2">
              {showcase.stats.map((item, index) => (
                <div key={`stat-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input
                      value={item.label}
                      placeholder="Label"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.stats];
                          next[index] = { ...next[index], label: e.target.value };
                          return { ...prev, stats: next };
                        })
                      }
                    />
                    <Input
                      value={item.value}
                      placeholder="Value"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.stats];
                          next[index] = { ...next[index], value: e.target.value };
                          return { ...prev, stats: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-2 grid min-w-0 gap-2 md:grid-cols-[minmax(80px,120px)_minmax(0,1fr)_auto]">
                    <Input
                      value={item.unit || ''}
                      placeholder="Unit"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.stats];
                          next[index] = { ...next[index], unit: e.target.value };
                          return { ...prev, stats: next };
                        })
                      }
                    />
                    <Input
                      value={item.source || ''}
                      placeholder="Source"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.stats];
                          next[index] = { ...next[index], source: e.target.value };
                          return { ...prev, stats: next };
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowcase((prev) => ({
                          ...prev,
                          stats: prev.stats.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">External links</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowcase((prev) => ({
                    ...prev,
                    links: [...prev.links, { label: '', url: '' }],
                  }))
                }
              >
                Add link
              </Button>
            </div>
            <div className="space-y-2">
              {showcase.links.map((item, index) => (
                <div key={`link-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(100px,160px)_minmax(0,1fr)_auto]">
                    <Input
                      value={item.label}
                      placeholder="Label"
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.links];
                          next[index] = { ...next[index], label: e.target.value };
                          return { ...prev, links: next };
                        })
                      }
                    />
                    <Input
                      value={item.url}
                      placeholder="https://..."
                      onChange={(e) =>
                        setShowcase((prev) => {
                          const next = [...prev.links];
                          next[index] = { ...next[index], url: e.target.value };
                          return { ...prev, links: next };
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowcase((prev) => ({
                          ...prev,
                          links: prev.links.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm">Challenges (one per line)</label>
            <Textarea rows={5} {...register('challengesText')} placeholder="Performance tuning..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Learnings (one per line)</label>
            <Textarea rows={5} {...register('learningsText')} placeholder="Improved state management..." />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm">Demo URL</label>
            <Input {...register('demoUrl')} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Video provider</label>
            <Select {...register('videoProvider')}>
              <option value="NONE">NONE</option>
              <option value="YOUTUBE">YOUTUBE</option>
              <option value="VIMEO">VIMEO</option>
              <option value="LOCAL">LOCAL</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm">Video URL</label>
            <Input {...register('videoUrl')} placeholder="https://youtube.com/..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Team size</label>
            <Input type="number" {...register('teamSize')} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm">Development time (days)</label>
            <Input type="number" {...register('developmentTimeDays')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Local video upload (optional)</label>
            <input
              className="block w-full max-w-full text-sm text-slate file:mr-3 file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-2 file:text-sm file:text-accent"
              type="file"
              accept="video/*"
              disabled={uploading}
              onChange={async (e) => {
                if (!e.target.files?.length) return;
                try {
                  setUploading(true);
                  const uploaded = await uploadFile(e.target.files[0], 'videos');
                  setShowcase((prev) => ({ ...prev, videoAsset: uploaded }));
                  setValue('videoProvider', 'LOCAL');
                  setValue('videoUrl', uploaded.path);
                } catch {
                  setError('Erro ao fazer upload do vídeo.');
                } finally {
                  setUploading(false);
                  e.currentTarget.value = '';
                }
              }}
            />
            {showcase.videoAsset ? (
              <p className="text-xs text-slate">{showcase.videoAsset.originalName}</p>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="min-w-0 space-y-4 md:p-7 xl:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Cover</p>
            <p className="text-sm font-semibold text-white">Primary media</p>
            <p className="text-xs text-slate">Upload de cover local (pasta covers).</p>
          </div>
          {cover ? (
            <Button type="button" variant="outline" size="sm" onClick={() => setCover(null)}>
              Remover
            </Button>
          ) : null}
        </div>
        <input
          className="block w-full max-w-full text-sm text-slate file:mr-3 file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-2 file:text-sm file:text-accent"
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={async (e) => {
            if (!e.target.files?.length) return;
            try {
              setUploading(true);
              const uploaded = await uploadFile(e.target.files[0], 'covers');
              setCover(uploaded);
            } catch {
              setError('Erro ao fazer upload do cover');
            } finally {
              setUploading(false);
              e.currentTarget.value = '';
            }
          }}
        />
        {cover ? (
          <div className="flex items-center gap-4 text-sm">
            <img src={`${apiBase}${cover.path}`} alt={cover.originalName} className="h-16 w-24 rounded-lg object-cover" />
            <div>
              <p>{cover.originalName}</p>
              <p className="break-all text-xs text-slate">{cover.path}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate">Sem cover selecionado.</p>
        )}
      </Card>

      <Card className="min-w-0 space-y-4 md:p-7 xl:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Gallery</p>
            <p className="text-sm font-semibold text-white">Ordered media set</p>
            <p className="text-xs text-slate">Upload, reordenação manual e seleção de cover.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setGallery([])} disabled={!gallery.length}>
            Limpar
          </Button>
        </div>
        <input
          className="block w-full max-w-full text-sm text-slate file:mr-3 file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-2 file:text-sm file:text-accent"
          type="file"
          multiple
          accept="image/*"
          disabled={uploading}
          onChange={async (e) => {
            if (!e.target.files?.length) return;
            try {
              setUploading(true);
              const uploads: MediaAsset[] = [];
              for (const file of Array.from(e.target.files)) {
                const uploaded = await uploadFile(file, 'images');
                uploads.push(uploaded);
              }
              setGallery((prev) => [...prev, ...uploads]);
            } catch {
              setError('Erro ao fazer upload da galeria');
            } finally {
              setUploading(false);
              e.currentTarget.value = '';
            }
          }}
        />
        {gallery.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {gallery.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex === null || dragIndex === index) return;
                  const next = [...gallery];
                  const [moved] = next.splice(dragIndex, 1);
                  next.splice(index, 0, moved);
                  setGallery(next);
                  setDragIndex(null);
                }}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs"
              >
                <img src={`${apiBase}${item.path}`} alt={item.originalName} className="h-28 w-full rounded-lg object-cover" />
                <p className="mt-2 truncate">{item.originalName}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate">Posição {index + 1}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setCover(item)}>
                    Usar como cover
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setGallery((prev) => prev.filter((g) => g.id !== item.id))}>
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate">Sem media na galeria.</p>
        )}
      </Card>

      <Card className="min-w-0 space-y-4 md:p-7 xl:p-8">
        <div>
          <p className="eyebrow">Details</p>
          <h3 className="font-display text-xl text-white">Type-specific links</h3>
          <p className="text-sm text-slate">Links e detalhes específicos por tipo.</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">Repo URL (DEV)</label>
            <Input className="mt-1" {...register('repoUrl')} />
          </div>
          <div>
            <label className="text-sm">Live URL (DEV)</label>
            <Input className="mt-1" {...register('liveUrl')} />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">Stack / Programas (csv)</label>
            <Input className="mt-1" placeholder="Next.js, NestJS, Prisma, Docker" {...register('stack')} />
          </div>
          <div>
            <label className="text-sm">Highlights (csv)</label>
            <Input className="mt-1" placeholder="Auth JWT, Upload local, Query filters" {...register('highlights')} />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">YouTube URL (VIDEO)</label>
            <Input className="mt-1" {...register('youtubeUrl')} />
          </div>
          <div>
            <label className="text-sm">Vimeo URL (VIDEO)</label>
            <Input className="mt-1" {...register('vimeoUrl')} />
          </div>
        </div>
      </Card>

      {snapshots.length ? (
        <Card className="min-w-0 space-y-4 md:p-7 xl:p-8">
          <div>
            <p className="eyebrow">Snapshots</p>
            <h3 className="font-display text-xl text-white">Local version history</h3>
            <p className="text-sm text-slate">Histórico simples guardado no browser atual.</p>
          </div>
          <div className="space-y-2">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-sm">
                <div>
                  <p className="text-white">{snapshot.label}</p>
                  <p className="text-xs text-slate">{new Date(snapshot.savedAt).toLocaleString()}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => restoreSnapshot(snapshot)}>
                  Restaurar
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {status ? <span className="text-sm text-slate">{status}</span> : null}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}

      <Button type="submit" className="justify-self-start" disabled={formState.isSubmitting || uploading || slugState.available === false}>
        {mode === 'edit' ? 'Guardar alterações' : 'Criar conteúdo'}
      </Button>
    </form>
  );
}
