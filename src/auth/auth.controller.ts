/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    try {
      const accessToken = await this.authService.login(req.user);
      console.log(req.user);
      const payload = {
        userId: req.user._id,
        email: req.user.email,
        role: req.user.role,
      };

      if (req.user.isBanned) {
        const today = new Date();
        if (req.user.banUntil < today) {
          await this.userService.update(req.user._id, payload, {
            isBanned: false,
          });
        }
      }

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
