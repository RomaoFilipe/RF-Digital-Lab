import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('content')
export class ContentController {
  constructor(private service: ContentService) {}

  @Get()
  listPublic(@Query() query: Record<string, any>) {
    return this.service.listPublic(query);
  }

  @UseGuards(AuthGuard)
  @Get('admin/list')
  listAdmin(@Query() query: Record<string, any>) {
    return this.service.listAdmin(query);
  }

  @UseGuards(AuthGuard)
  @Get('admin/slug-availability/check')
  checkSlug(@Query('slug') slug: string, @Query('ignoreId') ignoreId?: string) {
    return this.service.checkSlugAvailability(slug, ignoreId);
  }

  @UseGuards(AuthGuard)
  @Get('admin/:id')
  getAdmin(@Param('id') id: string) {
    return this.service.getAdminById(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) {
    return this.service.duplicate(id);
  }

  @Get(':slug')
  getPublic(@Param('slug') slug: string) {
    return this.service.getPublicBySlug(slug);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateContentDto) {
    return this.service.create(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
