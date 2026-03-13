import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsController {
    private tags;
    constructor(tags: TagsService);
    list(): any;
    create(dto: CreateTagDto): Promise<any>;
    update(id: string, dto: UpdateTagDto): Promise<any>;
    remove(id: string): any;
}
