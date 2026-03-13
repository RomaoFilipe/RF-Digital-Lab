import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(): any;
    create(dto: CreateTagDto): Promise<any>;
    update(id: string, dto: UpdateTagDto): Promise<any>;
    remove(id: string): any;
}
