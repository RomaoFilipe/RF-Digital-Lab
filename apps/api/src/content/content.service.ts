import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentStatus, ContentType, Prisma } from '@prisma/client';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { makeSlug } from '../utils/slug';
import { parsePagination } from '../utils/pagination';

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
        include: {
          coverMedia: true,
          tags: { include: { tag: true } },
        },
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
        include: {
          coverMedia: true,
          tags: { include: { tag: true } },
        },
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
      include: {
        coverMedia: true,
        tags: { include: { tag: true } },
        gallery: { include: { media: true }, orderBy: { position: 'asc' } },
        videoDetails: true,
        devDetails: true,
        threeDDetails: true,
        articleDetails: true,
        publicationDetails: true,
      },
    });
    if (!item) throw new NotFoundException('Content not found');
    return item;
  }

  async getAdminById(id: string) {
    const item = await this.prisma.contentItem.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        tags: { include: { tag: true } },
        gallery: { include: { media: true }, orderBy: { position: 'asc' } },
        videoDetails: true,
        devDetails: true,
        threeDDetails: true,
        articleDetails: true,
        publicationDetails: true,
      },
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
      publishedAt: dto.publishedAt === null
        ? null
        : dto.publishedAt
          ? new Date(dto.publishedAt)
          : shouldPublishNow
            ? new Date()
            : undefined,
      coverMedia: dto.coverMediaId === null
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

    return duplicated;
  }

  private buildWhere(query: Record<string, any>, isPublic: boolean): Prisma.ContentItemWhereInput {
    const where: Prisma.ContentItemWhereInput = {};

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
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (query.tags) {
      const tags = String(query.tags)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (tags.length) {
        where.tags = {
          some: {
            tag: {
              slug: { in: tags },
            },
          },
        };
      }
    }

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
    const normalized = tagSlugs
      .map((slug) => makeSlug(slug))
      .filter(Boolean);
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
}
