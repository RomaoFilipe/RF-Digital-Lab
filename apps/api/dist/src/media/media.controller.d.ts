import { MediaService } from './media.service';
export declare class MediaController {
    private media;
    constructor(media: MediaService);
    list(query: Record<string, any>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    upload(file: Express.Multer.File, folder?: string): Promise<any>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
