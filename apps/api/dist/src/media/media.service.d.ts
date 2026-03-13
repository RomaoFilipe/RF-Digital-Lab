import { PrismaService } from '../prisma/prisma.service';
import { MediaKind } from '@prisma/client';
export declare class MediaService {
    private prisma;
    constructor(prisma: PrismaService);
    list(query: Record<string, any>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    createMedia(data: {
        kind: MediaKind;
        path: string;
        originalName: string;
        mime: string;
        size: number;
        width?: number | null;
        height?: number | null;
        duration?: number | null;
    }): Promise<any>;
    removeMedia(id: string): Promise<{
        ok: boolean;
    }>;
}
