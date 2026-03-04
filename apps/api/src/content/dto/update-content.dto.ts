import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ContentStatus, ContentType } from '@prisma/client';

export class UpdateContentDto {
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsString()
  seoKeywords?: string;

  @IsOptional()
  @IsUUID()
  coverMediaId?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagSlugs?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryIds?: string[];

  @IsOptional()
  @IsString()
  youtubeUrl?: string;

  @IsOptional()
  @IsString()
  vimeoUrl?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  repoUrl?: string;

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @IsString()
  stack?: string;

  @IsOptional()
  @IsString()
  highlights?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string | null;
}
