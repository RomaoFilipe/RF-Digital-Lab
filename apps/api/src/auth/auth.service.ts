import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateAdmin(email: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return user;
  }

  async signToken(userId: number, email: string) {
    return this.jwt.signAsync({ sub: userId, email });
  }

  async login(email: string, password: string) {
    const user = await this.validateAdmin(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = await this.signToken(user.id, user.email);
    return { token, user: { id: user.id, email: user.email } };
  }

  async getMe(userId: number) {
    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Invalid session');
    return { id: user.id, email: user.email, lastLoginAt: user.lastLoginAt };
  }

  cookieOptions() {
    const secure = process.env.NODE_ENV === 'production';
    const domain = process.env.COOKIE_DOMAIN || undefined;
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure,
      domain,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };
  }
}
