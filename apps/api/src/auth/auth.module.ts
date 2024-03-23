import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { AccessTokenStrategy } from './accessToken.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
