import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { user, UserSelect } from 'database';
import { eq } from 'drizzle-orm';
import { DatabaseClient, DrizzleService } from 'src/drizzle/drizzle.service';
import { CreateUserInput } from 'src/graphql';

@Injectable()
export class AuthService {
  db: DatabaseClient;
  constructor(
    private readonly ds: DrizzleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.db = this.ds.db;
  }

  async signUp(createUser: CreateUserInput) {
    // check if user exists
    const foundUser = await this.db.query.user.findFirst({
      where({ email }, { eq }) {
        return eq(email, createUser.email);
      },
    });
    if (foundUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.db
      .insert(user)
      .values({
        ...createUser,
        password: await this.hashData(createUser.password),
        updatedAt: new Date(),
      })
      .returning()
      .then((resp) => resp[0]);

    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: { email: string; password: string }) {
    // Check if user exists
    const user = await this.db.query.user.findFirst({
      where({ email }, { eq }) {
        return eq(email, data.email);
      },
    });
    if (!user)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  private hashData(data: string) {
    return argon2.hash(data);
  }

  async logout(userId: string) {
    return this.db
      .update(user)
      .set({
        refreshToken: null,
        updatedAt: new Date(),
      })
      .where(eq(user.userId, userId));
  }

  async updateRefreshToken(userToUpdate: UserSelect, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.db
      .update(user)
      .set({
        refreshToken: hashedRefreshToken,
        updatedAt: new Date(),
      })
      .where(eq(user.userId, userToUpdate.userId));
  }

  async getTokens(user: UserSelect) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(result, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(result, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(_userId: string, refreshToken: string) {
    const user = await this.db.query.user.findFirst({
      where({ userId }, { eq }) {
        return eq(userId, _userId);
      },
    });
    if (!user || !user.refreshToken)
      throw new HttpException('Access Denied', HttpStatus.UNAUTHORIZED);
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new HttpException('Access Denied', HttpStatus.UNAUTHORIZED);
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }
}
