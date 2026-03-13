import { ContentStatus, ContentType } from '@prisma/client';
export declare class UpdateContentDto {
    type?: ContentType;
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    status?: ContentStatus;
    featured?: boolean;
    year?: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    coverMediaId?: string | null;
    tagSlugs?: string[];
    galleryIds?: string[];
    youtubeUrl?: string;
    vimeoUrl?: string;
    duration?: number;
    repoUrl?: string;
    liveUrl?: string;
    stack?: string;
    highlights?: string;
    publishedAt?: string | null;
}
