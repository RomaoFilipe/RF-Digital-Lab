import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaKind } from '@prisma/client';
import { promises as fs } from 'fs';
import { join } from 'path';
import { parsePagination } from '../utils/pagination';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async list(query: Record<string, any>) {
    const { page, limit, skip } = parsePagination(query);
    const rawKind = query.kind ? String(query.kind).toUpperCase() : undefined;
    const kind = rawKind && Object.values(MediaKind).includes(rawKind as MediaKind)
      ? (rawKind as MediaKind)
      : undefined;
    const where: any = {};

    if (kind) where.kind = kind;
    if (query.search) {
      where.OR = [
        { originalName: { contains: String(query.search), mode: 'insensitive' } },
        { path: { contains: String(query.search), mode: 'insensitive' } },
      ];
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) where.createdAt.gte = new Date(String(query.dateFrom));
      if (query.dateTo) where.createdAt.lte = new Date(String(query.dateTo));
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

  async createMedia(data: {
    kind: MediaKind;
    path: string;
    originalName: string;
    mime: string;
    size: number;
    width?: number | null;
    height?: number | null;
    duration?: number | null;
  }) {
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

  async removeMedia(id: string) {
    const media = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    await this.prisma.mediaAsset.delete({ where: { id } });

    const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
    const relative = media.path.replace(/^\/uploads\//, '');
    const fullPath = join(uploadDir, relative);

    try {
      await fs.unlink(fullPath);
    } catch (err) {
      // ignore missing file
    }

    return { ok: true };
  }
}
