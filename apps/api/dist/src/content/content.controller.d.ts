import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ProjectShowcaseDto } from './dto/project-showcase.dto';
export declare class ContentController {
    private service;
    constructor(service: ContentService);
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
    checkSlug(slug: string, ignoreId?: string): Promise<{
        slug: any;
        available: boolean;
    }>;
    getAdmin(id: string): Promise<any>;
    duplicate(id: string): Promise<any>;
    getPublicById(id: string): Promise<any>;
    incrementView(slug: string): Promise<{
        views: any;
    }>;
    getPublic(slug: string): Promise<any>;
    create(dto: CreateContentDto): Promise<any>;
    update(id: string, dto: UpdateContentDto): Promise<any>;
    updateShowcase(id: string, dto: ProjectShowcaseDto): Promise<any>;
    remove(id: string): Promise<any>;
}
