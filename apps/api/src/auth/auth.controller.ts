import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserInput } from 'src/graphql';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './accessToken.guard';
import { RefreshTokenGuard } from './refreshToken.guard';
import { cookieOptions, tokenAndCookieSender } from './tokenAndCookieSender';
import { extractJWTFromCookie } from './refreshToken.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserSelect } from 'database';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(
    @Body() body: CreateUserInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signUp(body);
    const user = await this.getUserFromToken(tokens.accessToken);
    tokenAndCookieSender(res, tokens, user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('ping')
  ping() {
    return true;
  }

  @Post('signin')
  async signIn(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(body);
    const user = await this.getUserFromToken(tokens.accessToken);
    tokenAndCookieSender(res, tokens, user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req['user']['userId']);
    res
      .clearCookie('refreshToken', cookieOptions)
      .send('Successfully Logged Out');
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req['user']['userId'];
    const refreshToken = extractJWTFromCookie(req);
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    const user = await this.getUserFromToken(tokens.accessToken);
    tokenAndCookieSender(res, tokens, user);
  }

  private async getUserFromToken(token: string) {
    const user = (await this.jwtService.decode(token)) as UserSelect;
    return user;
  }
}
