import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

export function extractJWTFromCookie(req: Request): string | null {
  let token: string | null = null;
  if (req.cookies && req.cookies.refreshToken) {
    token = req.cookies.refreshToken;
  }
  return token;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: extractJWTFromCookie,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = extractJWTFromCookie(req);
    return { ...payload, refreshToken };
  }
}
