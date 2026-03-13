import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentStatus, ContentType, Prisma, VideoProvider } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { makeSlug } from '../utils/slug';
import { parsePagination } from '../utils/pagination';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import {
  ArchitectureNodeDto,
  FeatureItemDto,
  ProjectShowcaseDto,
  ShowcaseItemDto,
  ShowcaseLinkDto,
  StatItemDto,
} from './dto/project-showcase.dto';

type NormalizedShowcasePayload = {
  technologies: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  tools: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  software: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  features: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  architecture: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  stats: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  links: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  challenges: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  learnings: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  techSlugs: string[];
  demoUrl: string | null;
  videoUrl: string | null;
  videoProvider: VideoProvider;
  videoAssetId: string | null;
  teamSize: number | null;
  developmentTimeDays: number | null;
};

const TAB_MAP: Record<string, ContentType> = {
  video: ContentType.VIDEO,
  image: ContentType.IMAGE,
  editing: ContentType.EDITING,
  dev: ContentType.DEV,
  '3d': ContentType.THREE_D,
  article: ContentType.ARTICLE,
  publication: ContentType.PUBLICATION,
  other: ContentType.OTHER,
};

const LIST_INCLUDE = {
  coverMedia: true,
  tags: { include: { tag: true } },
  showcase: {
    select: {
      technologies: true,
      tools: true,
      software: true,
      techSlugs: true,
      views: true,
      demoUrl: true,
      videoUrl: true,
    },
  },
} as const satisfies Prisma.ContentItemInclude;

const DETAIL_INCLUDE = {
  coverMedia: true,
  tags: { include: { tag: true } },
  gallery: { include: { media: true }, orderBy: { position: 'asc' } },
  videoDetails: true,
  devDetails: true,
  threeDDetails: true,
  articleDetails: true,
  publicationDetails: true,
  showcase: {
    include: {
      videoAsset: true,
    },
  },
} as const satisfies Prisma.ContentItemInclude;

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async listPublic(query: Record<string, any>) {
    const { page, limit, skip } = parsePagination(query);
    const where = this.buildWhere(query, true);
    const orderBy = this.buildOrder(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.contentItem.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: LIST_INCLUDE,
      }),
      this.prisma.contentItem.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async listAdmin(query: Record<string, any>) {
    const { page, limit, skip } = parsePagination(query);
    const where = this.buildWhere(query, false);
    const orderBy = this.buildOrder(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.contentItem.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: LIST_INCLUDE,
      }),
      this.prisma.contentItem.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPublicBySlug(slug: string) {
    const item = await this.prisma.contentItem.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      include: DETAIL_INCLUDE,
    });
    if (!item) throw new NotFoundException('Content not found');
    return item;
  }

  async getPublicById(id: string) {
    const item = await this.prisma.contentItem.findFirst({
      where: { id, status: ContentStatus.PUBLISHED },
      include: DETAIL_INCLUDE,
    });
    if (!item) throw new NotFoundException('Content not found');
    return item;
  }

  async getAdminById(id: string) {
    const item = await this.prisma.contentItem.findUnique({
      where: { id },
      include: DETAIL_INCLUDE,
    });
    if (!item) throw new NotFoundException('Content not found');
    return item;
  }

  async checkSlugAvailability(rawSlug: string, ignoreId?: string) {
    const normalized = makeSlug(rawSlug || '');
    if (!normalized) {
      return { slug: normalized, available: false };
    }
    const existing = await this.prisma.contentItem.findUnique({ where: { slug: normalized } });
    return {
      slug: normalized,
      available: !existing || existing.id === ignoreId,
    };
  }

  async create(dto: CreateContentDto) {
    const slugBase = dto.slug ? makeSlug(dto.slug) : makeSlug(dto.title);
    const slug = await this.ensureUniqueSlug(slugBase);
    const tagConnect = await this.resolveTags(dto.tagSlugs);

    const data: Prisma.ContentItemCreateInput = {
      type: dto.type,
      title: dto.title,
      slug,
      summary: dto.summary,
      content: dto.content,
      status: dto.status ?? ContentStatus.DRAFT,
      featured: dto.featured ?? false,
      year: dto.year,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      seoKeywords: dto.seoKeywords,
      publishedAt: dto.publishedAt
        ? new Date(dto.publishedAt)
        : dto.status === ContentStatus.PUBLISHED
          ? new Date()
          : undefined,
      coverMedia: dto.coverMediaId ? { connect: { id: dto.coverMediaId } } : undefined,
      tags: tagConnect.length
        ? { create: tagConnect.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
        : undefined,
    };

    const created = await this.prisma.contentItem.create({ data });

    await this.syncGallery(created.id, dto.galleryIds);
    await this.syncDetails(created.id, dto);

    return this.getAdminById(created.id);
  }

  async update(id: string, dto: UpdateContentDto) {
    const existing = await this.prisma.contentItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Content not found');

    let slug = existing.slug;
    if (dto.slug || dto.title) {
      const base = dto.slug ? makeSlug(dto.slug) : makeSlug(dto.title ?? existing.title);
      slug = await this.ensureUniqueSlug(base, id);
    }

    const tagConnect = dto.tagSlugs ? await this.resolveTags(dto.tagSlugs) : null;

    const shouldPublishNow =
      dto.status === ContentStatus.PUBLISHED && !existing.publishedAt && !dto.publishedAt;

    const data: Prisma.ContentItemUpdateInput = {
      type: dto.type,
      title: dto.title,
      slug,
      summary: dto.summary,
      content: dto.content,
      status: dto.status,
      featured: dto.featured,
      year: dto.year,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      seoKeywords: dto.seoKeywords,
      publishedAt:
        dto.publishedAt === null
          ? null
          : dto.publishedAt
            ? new Date(dto.publishedAt)
            : shouldPublishNow
              ? new Date()
              : undefined,
      coverMedia:
        dto.coverMediaId === null
          ? { disconnect: true }
          : dto.coverMediaId
            ? { connect: { id: dto.coverMediaId } }
            : undefined,
    };

    if (tagConnect) {
      await this.prisma.contentTag.deleteMany({ where: { contentId: id } });
      if (tagConnect.length) {
        await this.prisma.contentTag.createMany({
          data: tagConnect.map((tagId) => ({ contentId: id, tagId })),
          skipDuplicates: true,
        });
      }
    }

    await this.prisma.contentItem.update({ where: { id }, data });
    if (dto.galleryIds) await this.syncGallery(id, dto.galleryIds);
    await this.syncDetails(id, dto);

    return this.getAdminById(id);
  }

  async upsertShowcase(contentId: string, dto: ProjectShowcaseDto) {
    const content = await this.prisma.contentItem.findUnique({ where: { id: contentId } });
    if (!content) throw new NotFoundException('Content not found');

    const normalized = this.normalizeShowcaseDto(dto);
    const createData: Prisma.ProjectShowcaseUncheckedCreateInput = {
      contentId,
      ...normalized,
    };
    const updateData: Prisma.ProjectShowcaseUncheckedUpdateInput = {
      ...normalized,
    };

    await this.prisma.projectShowcase.upsert({
      where: { contentId },
      create: createData,
      update: updateData,
    });

    return this.getAdminById(contentId);
  }

  async incrementView(slug: string) {
    const item = await this.prisma.contentItem.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Content not found');

    const showcase = await this.prisma.projectShowcase.upsert({
      where: { contentId: item.id },
      create: {
        contentId: item.id,
        views: 1,
        videoProvider: VideoProvider.NONE,
      },
      update: {
        views: { increment: 1 },
      },
      select: { views: true },
    });

    return { views: showcase.views };
  }

  async remove(id: string) {
    await this.prisma.contentTag.deleteMany({ where: { contentId: id } });
    await this.prisma.contentMedia.deleteMany({ where: { contentId: id } });
    await this.prisma.videoDetails.deleteMany({ where: { contentId: id } });
    await this.prisma.devDetails.deleteMany({ where: { contentId: id } });
    await this.prisma.threeDDetails.deleteMany({ where: { contentId: id } });
    await this.prisma.articleDetails.deleteMany({ where: { contentId: id } });
    await this.prisma.publicationDetails.deleteMany({ where: { contentId: id } });
    return this.prisma.contentItem.delete({ where: { id } });
  }

  async duplicate(id: string) {
    const item = await this.getAdminById(id);
    const duplicated = await this.create({
      type: item.type,
      title: `${item.title} Copy`,
      slug: `${item.slug}-copy`,
      summary: item.summary ?? undefined,
      content: item.content ?? undefined,
      status: ContentStatus.DRAFT,
      featured: false,
      year: item.year ?? undefined,
      seoTitle: item.seoTitle ?? undefined,
      seoDescription: item.seoDescription ?? undefined,
      seoKeywords: item.seoKeywords ?? undefined,
      coverMediaId: item.coverMedia?.id ?? undefined,
      tagSlugs: item.tags?.map((entry) => entry.tag.slug) ?? [],
      galleryIds: item.gallery?.map((entry) => entry.media.id) ?? [],
      youtubeUrl: item.videoDetails?.youtubeUrl ?? undefined,
      vimeoUrl: item.videoDetails?.vimeoUrl ?? undefined,
      duration: item.videoDetails?.duration ?? undefined,
      repoUrl: item.devDetails?.repoUrl ?? undefined,
      liveUrl: item.devDetails?.liveUrl ?? undefined,
      stack: item.devDetails?.stack ?? undefined,
      highlights: item.devDetails?.highlights ?? undefined,
    });

    if (item.showcase) {
      await this.prisma.projectShowcase.create({
        data: {
          contentId: duplicated.id,
          technologies: this.cloneJson(item.showcase.technologies),
          tools: this.cloneJson(item.showcase.tools),
          software: this.cloneJson(item.showcase.software),
          features: this.cloneJson(item.showcase.features),
          architecture: this.cloneJson(item.showcase.architecture),
          stats: this.cloneJson(item.showcase.stats),
          links: this.cloneJson(item.showcase.links),
          challenges: this.cloneJson(item.showcase.challenges),
          learnings: this.cloneJson(item.showcase.learnings),
          techSlugs: item.showcase.techSlugs,
          demoUrl: item.showcase.demoUrl,
          videoUrl: item.showcase.videoUrl,
          videoProvider: item.showcase.videoProvider,
          videoAssetId: item.showcase.videoAssetId,
          teamSize: item.showcase.teamSize,
          developmentTimeDays: item.showcase.developmentTimeDays,
        },
      });
    }

    return this.getAdminById(duplicated.id);
  }

  private buildWhere(query: Record<string, any>, isPublic: boolean): Prisma.ContentItemWhereInput {
    const where: Prisma.ContentItemWhereInput = {};
    const and: Prisma.ContentItemWhereInput[] = [];

    if (isPublic) {
      where.status = ContentStatus.PUBLISHED;
    } else if (query.status) {
      where.status = query.status;
    }

    if (query.tab && query.tab !== 'all') {
      const mapped = TAB_MAP[String(query.tab).toLowerCase()];
      if (mapped) where.type = mapped;
    }

    if (query.year) {
      const year = parseInt(query.year, 10);
      if (!Number.isNaN(year)) where.year = year;
    }

    if (query.featured !== undefined) {
      if (query.featured === 'true' || query.featured === true) where.featured = true;
      if (query.featured === 'false') where.featured = false;
    }

    if (query.search) {
      const search = String(query.search);
      and.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (query.tags) {
      const tags = String(query.tags)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (tags.length) {
        and.push({
          tags: {
            some: {
              tag: {
                slug: { in: tags },
              },
            },
          },
        });
      }
    }

    if (query.tech) {
      const techValues = String(query.tech)
        .split(',')
        .map((item) => makeSlug(item))
        .filter(Boolean);
      if (techValues.length) {
        and.push({
          showcase: {
            is: {
              techSlugs: {
                hasSome: techValues,
              },
            },
          },
        });
      }
    }

    if (and.length) where.AND = and;
    return where;
  }

  private buildOrder(query: Record<string, any>): Prisma.ContentItemOrderByWithRelationInput[] {
    const sort = String(query.sort || 'newest').toLowerCase();
    if (sort === 'oldest') return [{ createdAt: 'asc' }];
    if (sort === 'featured') return [{ featured: 'desc' }, { createdAt: 'desc' }];
    return [{ createdAt: 'desc' }];
  }

  private async ensureUniqueSlug(base: string, ignoreId?: string) {
    let slug = base;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.contentItem.findUnique({ where: { slug } });
      if (!existing || existing.id === ignoreId) return slug;
      slug = `${base}-${counter}`;
      counter += 1;
    }
  }

  private async resolveTags(tagSlugs?: string[]) {
    if (!tagSlugs?.length) return [];
    const normalized = tagSlugs.map((slug) => makeSlug(slug)).filter(Boolean);
    const tags = await Promise.all(
      normalized.map(async (slug) => {
        const existing = await this.prisma.tag.findUnique({ where: { slug } });
        if (existing) return existing.id;
        const name = slug
          .split('-')
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(' ');
        const created = await this.prisma.tag.create({ data: { slug, name } });
        return created.id;
      }),
    );
    return tags;
  }

  private async syncGallery(contentId: string, galleryIds?: string[]) {
    if (!galleryIds) return;
    await this.prisma.contentMedia.deleteMany({ where: { contentId } });
    if (!galleryIds.length) return;

    await this.prisma.contentMedia.createMany({
      data: galleryIds.map((mediaId, index) => ({
        contentId,
        mediaId,
        position: index,
      })),
      skipDuplicates: true,
    });
  }

  private async syncDetails(contentId: string, dto: CreateContentDto | UpdateContentDto) {
    if (dto.type === ContentType.VIDEO || dto.youtubeUrl || dto.vimeoUrl) {
      await this.prisma.videoDetails.upsert({
        where: { contentId },
        create: {
          contentId,
          youtubeUrl: dto.youtubeUrl,
          vimeoUrl: dto.vimeoUrl,
          duration: dto.duration,
        },
        update: {
          youtubeUrl: dto.youtubeUrl,
          vimeoUrl: dto.vimeoUrl,
          duration: dto.duration,
        },
      });
    }

    if (dto.type === ContentType.DEV || dto.repoUrl || dto.liveUrl) {
      await this.prisma.devDetails.upsert({
        where: { contentId },
        create: {
          contentId,
          repoUrl: dto.repoUrl,
          liveUrl: dto.liveUrl,
          stack: dto.stack,
          highlights: dto.highlights,
        },
        update: {
          repoUrl: dto.repoUrl,
          liveUrl: dto.liveUrl,
          stack: dto.stack,
          highlights: dto.highlights,
        },
      });
    }

    if (dto.type === ContentType.ARTICLE) {
      await this.prisma.articleDetails.upsert({
        where: { contentId },
        create: { contentId },
        update: {},
      });
    }
  }

  private normalizeShowcaseItems(items?: ShowcaseItemDto[]) {
    if (!items?.length) return null;
    const seen = new Set<string>();
    const normalized: Array<{ name: string; slug: string; icon?: string }> = [];

    for (const item of items) {
      const name = (item.name || '').trim();
      if (!name) continue;
      const slug = makeSlug(item.slug || item.name);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      normalized.push({
        name,
        slug,
        ...(item.icon ? { icon: item.icon.trim() } : {}),
      });
    }

    return normalized.length ? normalized : null;
  }

  private normalizeFeatureItems(items?: FeatureItemDto[]) {
    if (!items?.length) return null;
    const normalized = items
      .map((item) => ({
        name: (item.name || '').trim(),
        icon: item.icon?.trim() || undefined,
        description: item.description?.trim() || undefined,
      }))
      .filter((item) => item.name);
    return normalized.length ? normalized : null;
  }

  private normalizeArchitecture(items?: ArchitectureNodeDto[]) {
    if (!items?.length) return null;
    const normalized = items
      .map((item) => ({
        layer: (item.layer || '').trim(),
        value: (item.value || '').trim(),
        notes: item.notes?.trim() || undefined,
      }))
      .filter((item) => item.layer && item.value);
    return normalized.length ? normalized : null;
  }

  private normalizeStats(items?: StatItemDto[]) {
    if (!items?.length) return null;
    const normalized = items
      .map((item) => ({
        label: (item.label || '').trim(),
        value: (item.value || '').trim(),
        unit: item.unit?.trim() || undefined,
        source: item.source?.trim() || undefined,
      }))
      .filter((item) => item.label && item.value);
    return normalized.length ? normalized : null;
  }

  private normalizeLinks(items?: ShowcaseLinkDto[]) {
    if (!items?.length) return null;
    const normalized = items
      .map((item) => ({
        label: (item.label || '').trim(),
        url: (item.url || '').trim(),
      }))
      .filter((item) => item.label && item.url);
    return normalized.length ? normalized : null;
  }

  private normalizeStringList(items?: string[]) {
    if (!items?.length) return null;
    const deduped = Array.from(
      new Set(
        items
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
    return deduped.length ? deduped : null;
  }

  private normalizeShowcaseDto(dto: ProjectShowcaseDto): NormalizedShowcasePayload {
    const technologies = this.normalizeShowcaseItems(dto.technologies);
    const tools = this.normalizeShowcaseItems(dto.tools);
    const software = this.normalizeShowcaseItems(dto.software);

    const techSlugs = Array.from(
      new Set(
        [...(technologies ?? []), ...(tools ?? []), ...(software ?? [])]
          .map((item) => item.slug)
          .filter(Boolean),
      ),
    );

    return {
      technologies: this.toJsonField(technologies),
      tools: this.toJsonField(tools),
      software: this.toJsonField(software),
      features: this.toJsonField(this.normalizeFeatureItems(dto.features)),
      architecture: this.toJsonField(this.normalizeArchitecture(dto.architecture)),
      stats: this.toJsonField(this.normalizeStats(dto.stats)),
      links: this.toJsonField(this.normalizeLinks(dto.links)),
      challenges: this.toJsonField(this.normalizeStringList(dto.challenges)),
      learnings: this.toJsonField(this.normalizeStringList(dto.learnings)),
      techSlugs,
      demoUrl: dto.demoUrl?.trim() || null,
      videoUrl: dto.videoUrl?.trim() || null,
      videoProvider: dto.videoProvider ?? VideoProvider.NONE,
      videoAssetId: dto.videoAssetId ?? null,
      teamSize: dto.teamSize ?? null,
      developmentTimeDays: dto.developmentTimeDays ?? null,
    };
  }

  private toJsonField(value: unknown): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue {
    if (value === null || value === undefined) {
      return Prisma.DbNull;
    }
    return value as Prisma.InputJsonValue;
  }

  private cloneJson(value: Prisma.JsonValue | null | undefined): Prisma.InputJsonValue | undefined {
    if (value === null || value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
