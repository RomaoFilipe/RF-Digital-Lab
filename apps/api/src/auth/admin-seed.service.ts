import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return;
    }

    const existing = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);
      await this.prisma.adminUser.create({
        data: { email, passwordHash },
      });
    }

    const settingsCount = await this.prisma.siteSettings.count();
    if (settingsCount === 0) {
      await this.prisma.siteSettings.create({ data: {} });
    }
  }
}
