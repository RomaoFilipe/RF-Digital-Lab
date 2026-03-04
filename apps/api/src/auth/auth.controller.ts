import { Body, Controller, Get, Post, Res, UseGuards, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { token, user } = await this.auth.login(dto.email, dto.password);
    res.cookie('access_token', token, this.auth.cookieOptions());
    return res.json({ user });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', this.auth.cookieOptions());
    return res.json({ ok: true });
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const userId = (req as any).userId as number;
    return this.auth.getMe(userId);
  }
}
