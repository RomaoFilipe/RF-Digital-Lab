import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { VideoProvider } from '@prisma/client';

export class ShowcaseItemDto {
  @IsString()
  @MaxLength(64)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  icon?: string;
}

export class FeatureItemDto {
  @IsString()
  @MaxLength(80)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  description?: string;
}

export class ArchitectureNodeDto {
  @IsString()
  @MaxLength(64)
  layer!: string;

  @IsString()
  @MaxLength(180)
  value!: string;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  notes?: string;
}

export class StatItemDto {
  @IsString()
  @MaxLength(64)
  label!: string;

  @IsString()
  @MaxLength(64)
  value!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;
}

export class ShowcaseLinkDto {
  @IsString()
  @MaxLength(64)
  label!: string;

  @IsUrl()
  url!: string;
}

export class ProjectShowcaseDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ShowcaseItemDto)
  technologies?: ShowcaseItemDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ShowcaseItemDto)
  tools?: ShowcaseItemDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ShowcaseItemDto)
  software?: ShowcaseItemDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(24)
  @ValidateNested({ each: true })
  @Type(() => FeatureItemDto)
  features?: FeatureItemDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ArchitectureNodeDto)
  architecture?: ArchitectureNodeDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => StatItemDto)
  stats?: StatItemDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(16)
  @ValidateNested({ each: true })
  @Type(() => ShowcaseLinkDto)
  links?: ShowcaseLinkDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(220, { each: true })
  challenges?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(220, { each: true })
  learnings?: string[];

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsEnum(VideoProvider)
  videoProvider?: VideoProvider;

  @IsOptional()
  @IsUUID()
  videoAssetId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  teamSize?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  developmentTimeDays?: number;
}
