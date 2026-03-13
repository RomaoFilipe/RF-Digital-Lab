import { VideoProvider } from '@prisma/client';
export declare class ShowcaseItemDto {
    name: string;
    slug?: string;
    icon?: string;
}
export declare class FeatureItemDto {
    name: string;
    icon?: string;
    description?: string;
}
export declare class ArchitectureNodeDto {
    layer: string;
    value: string;
    notes?: string;
}
export declare class StatItemDto {
    label: string;
    value: string;
    unit?: string;
    source?: string;
}
export declare class ShowcaseLinkDto {
    label: string;
    url: string;
}
export declare class ProjectShowcaseDto {
    technologies?: ShowcaseItemDto[];
    tools?: ShowcaseItemDto[];
    software?: ShowcaseItemDto[];
    features?: FeatureItemDto[];
    architecture?: ArchitectureNodeDto[];
    stats?: StatItemDto[];
    links?: ShowcaseLinkDto[];
    challenges?: string[];
    learnings?: string[];
    demoUrl?: string;
    videoUrl?: string;
    videoProvider?: VideoProvider;
    videoAssetId?: string;
    teamSize?: number;
    developmentTimeDays?: number;
}
