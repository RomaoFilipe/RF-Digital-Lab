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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const fs_1 = require("fs");
const path_1 = require("path");
const pagination_1 = require("../utils/pagination");
let MediaService = class MediaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const { page, limit, skip } = (0, pagination_1.parsePagination)(query);
        const rawKind = query.kind ? String(query.kind).toUpperCase() : undefined;
        const kind = rawKind && Object.values(client_1.MediaKind).includes(rawKind)
            ? rawKind
            : undefined;
        const where = {};
        if (kind)
            where.kind = kind;
        if (query.search) {
            where.OR = [
                { originalName: { contains: String(query.search), mode: 'insensitive' } },
                { path: { contains: String(query.search), mode: 'insensitive' } },
            ];
        }
        if (query.dateFrom || query.dateTo) {
            where.createdAt = {};
            if (query.dateFrom)
                where.createdAt.gte = new Date(String(query.dateFrom));
            if (query.dateTo)
                where.createdAt.lte = new Date(String(query.dateTo));
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.mediaAsset.findMany({
                where: Object.keys(where).length ? where : undefined,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.mediaAsset.count({ where: Object.keys(where).length ? where : undefined }),
        ]);
        return {
            items,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
    async createMedia(data) {
        return this.prisma.mediaAsset.create({
            data: {
                kind: data.kind,
                path: data.path,
                originalName: data.originalName,
                mime: data.mime,
                size: data.size,
                width: data.width ?? null,
                height: data.height ?? null,
                duration: data.duration ?? null,
            },
        });
    }
    async removeMedia(id) {
        const media = await this.prisma.mediaAsset.findUnique({ where: { id } });
        if (!media)
            throw new common_1.NotFoundException('Media not found');
        await this.prisma.mediaAsset.delete({ where: { id } });
        const uploadDir = process.env.UPLOAD_DIR || (0, path_1.join)(process.cwd(), 'uploads');
        const relative = media.path.replace(/^\/uploads\//, '');
        const fullPath = (0, path_1.join)(uploadDir, relative);
        try {
            await fs_1.promises.unlink(fullPath);
        }
        catch (err) {
        }
        return { ok: true };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map