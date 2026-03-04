import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { makeSlug } from '../utils/slug';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateTagDto) {
    const slug = makeSlug(dto.name);
    return this.prisma.tag.upsert({
      where: { slug },
      update: { name: dto.name },
      create: { name: dto.name, slug },
    });
  }

  async update(id: string, dto: UpdateTagDto) {
    const data: any = {};
    if (dto.name) {
      data.name = dto.name;
      data.slug = makeSlug(dto.name);
    }
    return this.prisma.tag.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
