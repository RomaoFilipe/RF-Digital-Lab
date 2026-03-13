"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const slug_1 = require("../utils/slug");
const pagination_1 = require("../utils/pagination");
const TAB_MAP = {
    video: client_1.ContentType.VIDEO,
    image: client_1.ContentType.IMAGE,
    editing: client_1.ContentType.EDITING,
    dev: client_1.ContentType.DEV,
    '3d': client_1.ContentType.THREE_D,
    article: client_1.ContentType.ARTICLE,
    publication: client_1.ContentType.PUBLICATION,
    other: client_1.ContentType.OTHER,
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
};
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
};
let ContentService = class ContentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listPublic(query) {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(query);
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
    async listAdmin(query) {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(query);
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
    async getPublicBySlug(slug) {
        const item = await this.prisma.contentItem.findFirst({
            where: { slug, status: client_1.ContentStatus.PUBLISHED },
            include: DETAIL_INCLUDE,
        });
        if (!item)
            throw new common_1.NotFoundException('Content not found');
        return item;
    }
    async getPublicById(id) {
        const item = await this.prisma.contentItem.findFirst({
            where: { id, status: client_1.ContentStatus.PUBLISHED },
            include: DETAIL_INCLUDE,
        });
        if (!item)
            throw new common_1.NotFoundException('Content not found');
        return item;
    }
    async getAdminById(id) {
        const item = await this.prisma.contentItem.findUnique({
            where: { id },
            include: DETAIL_INCLUDE,
        });
        if (!item)
            throw new common_1.NotFoundException('Content not found');
        return item;
    }
    async checkSlugAvailability(rawSlug, ignoreId) {
        const normalized = (0, slug_1.makeSlug)(rawSlug || '');
        if (!normalized) {
            return { slug: normalized, available: false };
        }
        const existing = await this.prisma.contentItem.findUnique({ where: { slug: normalized } });
        return {
            slug: normalized,
            available: !existing || existing.id === ignoreId,
        };
    }
    async create(dto) {
        const slugBase = dto.slug ? (0, slug_1.makeSlug)(dto.slug) : (0, slug_1.makeSlug)(dto.title);
        const slug = await this.ensureUniqueSlug(slugBase);
        const tagConnect = await this.resolveTags(dto.tagSlugs);
        const data = {
            type: dto.type,
            title: dto.title,
            slug,
            summary: dto.summary,
            content: dto.content,
            status: dto.status ?? client_1.ContentStatus.DRAFT,
            featured: dto.featured ?? false,
            year: dto.year,
            seoTitle: dto.seoTitle,
            seoDescription: dto.seoDescription,
            seoKeywords: dto.seoKeywords,
            publishedAt: dto.publishedAt
                ? new Date(dto.publishedAt)
                : dto.status === client_1.ContentStatus.PUBLISHED
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
    async update(id, dto) {
        const existing = await this.prisma.contentItem.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Content not found');
        let slug = existing.slug;
        if (dto.slug || dto.title) {
            const base = dto.slug ? (0, slug_1.makeSlug)(dto.slug) : (0, slug_1.makeSlug)(dto.title ?? existing.title);
            slug = await this.ensureUniqueSlug(base, id);
        }
        const tagConnect = dto.tagSlugs ? await this.resolveTags(dto.tagSlugs) : null;
        const shouldPublishNow = dto.status === client_1.ContentStatus.PUBLISHED && !existing.publishedAt && !dto.publishedAt;
        const data = {
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
        if (dto.galleryIds)
            await this.syncGallery(id, dto.galleryIds);
        await this.syncDetails(id, dto);
        return this.getAdminById(id);
    }
    async upsertShowcase(contentId, dto) {
        const content = await this.prisma.contentItem.findUnique({ where: { id: contentId } });
        if (!content)
            throw new common_1.NotFoundException('Content not found');
        const normalized = this.normalizeShowcaseDto(dto);
        const createData = {
            contentId,
            ...normalized,
        };
        const updateData = {
            ...normalized,
        };
        await this.prisma.projectShowcase.upsert({
            where: { contentId },
            create: createData,
            update: updateData,
        });
        return this.getAdminById(contentId);
    }
    async incrementView(slug) {
        const item = await this.prisma.contentItem.findFirst({
            where: { slug, status: client_1.ContentStatus.PUBLISHED },
            select: { id: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Content not found');
        const showcase = await this.prisma.projectShowcase.upsert({
            where: { contentId: item.id },
            create: {
                contentId: item.id,
                views: 1,
                videoProvider: client_1.VideoProvider.NONE,
            },
            update: {
                views: { increment: 1 },
            },
            select: { views: true },
        });
        return { views: showcase.views };
    }
    async remove(id) {
        await this.prisma.contentTag.deleteMany({ where: { contentId: id } });
        await this.prisma.contentMedia.deleteMany({ where: { contentId: id } });
        await this.prisma.videoDetails.deleteMany({ where: { contentId: id } });
        await this.prisma.devDetails.deleteMany({ where: { contentId: id } });
        await this.prisma.threeDDetails.deleteMany({ where: { contentId: id } });
        await this.prisma.articleDetails.deleteMany({ where: { contentId: id } });
        await this.prisma.publicationDetails.deleteMany({ where: { contentId: id } });
        return this.prisma.contentItem.delete({ where: { id } });
    }
    async duplicate(id) {
        const item = await this.getAdminById(id);
        const duplicated = await this.create({
            type: item.type,
            title: `${item.title} Copy`,
            slug: `${item.slug}-copy`,
            summary: item.summary ?? undefined,
            content: item.content ?? undefined,
            status: client_1.ContentStatus.DRAFT,
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
    buildWhere(query, isPublic) {
        const where = {};
        const and = [];
        if (isPublic) {
            where.status = client_1.ContentStatus.PUBLISHED;
        }
        else if (query.status) {
            where.status = query.status;
        }
        if (query.tab && query.tab !== 'all') {
            const mapped = TAB_MAP[String(query.tab).toLowerCase()];
            if (mapped)
                where.type = mapped;
        }
        if (query.year) {
            const year = parseInt(query.year, 10);
            if (!Number.isNaN(year))
                where.year = year;
        }
        if (query.featured !== undefined) {
            if (query.featured === 'true' || query.featured === true)
                where.featured = true;
            if (query.featured === 'false')
                where.featured = false;
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
                .map((item) => (0, slug_1.makeSlug)(item))
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
        if (and.length)
            where.AND = and;
        return where;
    }
    buildOrder(query) {
        const sort = String(query.sort || 'newest').toLowerCase();
        if (sort === 'oldest')
            return [{ createdAt: 'asc' }];
        if (sort === 'featured')
            return [{ featured: 'desc' }, { createdAt: 'desc' }];
        return [{ createdAt: 'desc' }];
    }
    async ensureUniqueSlug(base, ignoreId) {
        let slug = base;
        let counter = 1;
        while (true) {
            const existing = await this.prisma.contentItem.findUnique({ where: { slug } });
            if (!existing || existing.id === ignoreId)
                return slug;
            slug = `${base}-${counter}`;
            counter += 1;
        }
    }
    async resolveTags(tagSlugs) {
        if (!tagSlugs?.length)
            return [];
        const normalized = tagSlugs.map((slug) => (0, slug_1.makeSlug)(slug)).filter(Boolean);
        const tags = await Promise.all(normalized.map(async (slug) => {
            const existing = await this.prisma.tag.findUnique({ where: { slug } });
            if (existing)
                return existing.id;
            const name = slug
                .split('-')
                .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                .join(' ');
            const created = await this.prisma.tag.create({ data: { slug, name } });
            return created.id;
        }));
        return tags;
    }
    async syncGallery(contentId, galleryIds) {
        if (!galleryIds)
            return;
        await this.prisma.contentMedia.deleteMany({ where: { contentId } });
        if (!galleryIds.length)
            return;
        await this.prisma.contentMedia.createMany({
            data: galleryIds.map((mediaId, index) => ({
                contentId,
                mediaId,
                position: index,
            })),
            skipDuplicates: true,
        });
    }
    async syncDetails(contentId, dto) {
        if (dto.type === client_1.ContentType.VIDEO || dto.youtubeUrl || dto.vimeoUrl) {
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
        if (dto.type === client_1.ContentType.DEV || dto.repoUrl || dto.liveUrl) {
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
        if (dto.type === client_1.ContentType.ARTICLE) {
            await this.prisma.articleDetails.upsert({
                where: { contentId },
                create: { contentId },
                update: {},
            });
        }
    }
    normalizeShowcaseItems(items) {
        if (!items?.length)
            return null;
        const seen = new Set();
        const normalized = [];
        for (const item of items) {
            const name = (item.name || '').trim();
            if (!name)
                continue;
            const slug = (0, slug_1.makeSlug)(item.slug || item.name);
            if (!slug || seen.has(slug))
                continue;
            seen.add(slug);
            normalized.push({
                name,
                slug,
                ...(item.icon ? { icon: item.icon.trim() } : {}),
            });
        }
        return normalized.length ? normalized : null;
    }
    normalizeFeatureItems(items) {
        if (!items?.length)
            return null;
        const normalized = items
            .map((item) => ({
            name: (item.name || '').trim(),
            icon: item.icon?.trim() || undefined,
            description: item.description?.trim() || undefined,
        }))
            .filter((item) => item.name);
        return normalized.length ? normalized : null;
    }
    normalizeArchitecture(items) {
        if (!items?.length)
            return null;
        const normalized = items
            .map((item) => ({
            layer: (item.layer || '').trim(),
            value: (item.value || '').trim(),
            notes: item.notes?.trim() || undefined,
        }))
            .filter((item) => item.layer && item.value);
        return normalized.length ? normalized : null;
    }
    normalizeStats(items) {
        if (!items?.length)
            return null;
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
    normalizeLinks(items) {
        if (!items?.length)
            return null;
        const normalized = items
            .map((item) => ({
            label: (item.label || '').trim(),
            url: (item.url || '').trim(),
        }))
            .filter((item) => item.label && item.url);
        return normalized.length ? normalized : null;
    }
    normalizeStringList(items) {
        if (!items?.length)
            return null;
        const deduped = Array.from(new Set(items
            .map((item) => item.trim())
            .filter(Boolean)));
        return deduped.length ? deduped : null;
    }
    normalizeShowcaseDto(dto) {
        const technologies = this.normalizeShowcaseItems(dto.technologies);
        const tools = this.normalizeShowcaseItems(dto.tools);
        const software = this.normalizeShowcaseItems(dto.software);
        const techSlugs = Array.from(new Set([...(technologies ?? []), ...(tools ?? []), ...(software ?? [])]
            .map((item) => item.slug)
            .filter(Boolean)));
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
            videoProvider: dto.videoProvider ?? client_1.VideoProvider.NONE,
            videoAssetId: dto.videoAssetId ?? null,
            teamSize: dto.teamSize ?? null,
            developmentTimeDays: dto.developmentTimeDays ?? null,
        };
    }
    toJsonField(value) {
        if (value === null || value === undefined) {
            return client_1.Prisma.DbNull;
        }
        return value;
    }
    cloneJson(value) {
        if (value === null || value === undefined)
            return undefined;
        return JSON.parse(JSON.stringify(value));
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map