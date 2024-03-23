import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserInput } from 'src/graphql';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './accessToken.guard';
import { RefreshTokenGuard } from './refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body: CreateUserInput) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    this.authService.logout(req['user']['userId']);
    return 'Successfully Logged Out';
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Req() req: Request) {
    const userId = req['user']['userId'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
