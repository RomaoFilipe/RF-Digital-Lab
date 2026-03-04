import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.access_token;
    if (!token) throw new UnauthorizedException('Missing auth token');

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'dev-secret',
      });
      (req as any).userId = payload.sub;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid auth token');
    }
  }
}
