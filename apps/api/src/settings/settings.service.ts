import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const existing = await this.prisma.siteSettings.findFirst();
    if (existing) return existing;
    return this.prisma.siteSettings.create({ data: {} });
  }

  async update(dto: UpdateSettingsDto) {
    const existing = await this.get();
    return this.prisma.siteSettings.update({
      where: { id: existing.id },
      data: dto,
    });
  }
}
