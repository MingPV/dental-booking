/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    try {
      const accessToken = await this.authService.login(req.user);
      const token =
        typeof accessToken === 'string'
          ? accessToken
          : accessToken.access_token;
      res.cookie('access_token', token, {
        httpOnly: true,
      });
      return { message: 'Successfully logged in' };
    } catch (error) {
      return { message: 'Failed to log in', error: error.message };
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Successfully logged out' };
  }
}
