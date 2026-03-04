import { Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { MediaService } from './media.service';
import { AuthGuard } from '../auth/auth.guard';
import { MediaKind } from '@prisma/client';

const FOLDERS = new Set(['images', 'videos', 'files', 'covers']);

function ensureDir(path: string) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function kindFromMime(mime: string): MediaKind {
  if (mime.startsWith('image/')) return MediaKind.IMAGE;
  if (mime.startsWith('video/')) return MediaKind.VIDEO;
  return MediaKind.FILE;
}

@Controller('media')
export class MediaController {
  constructor(private media: MediaService) {}

  @UseGuards(AuthGuard)
  @Get()
  list(@Query() query: Record<string, any>) {
    return this.media.list(query);
  }

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, cb) => {
          const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
          const folder = String(req.query.folder || 'images');
          const safeFolder = FOLDERS.has(folder) ? folder : 'images';
          const dest = join(uploadDir, safeFolder);
          ensureDir(dest);
          cb(null, dest);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname) || '';
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    const safeFolder = FOLDERS.has(String(folder)) ? String(folder) : 'images';
    const relativePath = `/uploads/${safeFolder}/${file.filename}`;

    const created = await this.media.createMedia({
      kind: kindFromMime(file.mimetype),
      path: relativePath,
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
    });

    return created;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.media.removeMedia(id);
  }
}
