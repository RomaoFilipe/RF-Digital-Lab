import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ProjectShowcaseDto } from './dto/project-showcase.dto';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    listPublic(query: Record<string, any>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    listAdmin(query: Record<string, any>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    getPublicBySlug(slug: string): Promise<any>;
    getPublicById(id: string): Promise<any>;
    getAdminById(id: string): Promise<any>;
    checkSlugAvailability(rawSlug: string, ignoreId?: string): Promise<{
        slug: any;
        available: boolean;
    }>;
    create(dto: CreateContentDto): Promise<any>;
    update(id: string, dto: UpdateContentDto): Promise<any>;
    upsertShowcase(contentId: string, dto: ProjectShowcaseDto): Promise<any>;
    incrementView(slug: string): Promise<{
        views: any;
    }>;
    remove(id: string): Promise<any>;
    duplicate(id: string): Promise<any>;
    private buildWhere;
    private buildOrder;
    private ensureUniqueSlug;
    private resolveTags;
    private syncGallery;
    private syncDetails;
    private normalizeShowcaseItems;
    private normalizeFeatureItems;
    private normalizeArchitecture;
    private normalizeStats;
    private normalizeLinks;
    private normalizeStringList;
    private normalizeShowcaseDto;
    private toJsonField;
    private cloneJson;
}
