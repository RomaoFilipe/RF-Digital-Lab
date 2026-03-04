import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private tags: TagsService) {}

  @Get()
  list() {
    return this.tags.list();
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tags.create(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tags.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tags.remove(id);
  }
}
