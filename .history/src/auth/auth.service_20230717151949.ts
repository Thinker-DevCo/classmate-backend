import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './@types';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes } from 'crypto';
import { OauthDto } from './dto/oauth.dto';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  //returns the user, an access token and a refresh token
  async signUp(dto: SignUpDto) {
    try {
      const oauthExists = await this.prisma.oAuthUser.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (oauthExists)
        throw new ForbiddenException(
          'user already exists in the oatuh database',
        );
      let hash = await this.hashData(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash_password: hash,
          profile_image: dto.profile_image,
        },
      });
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);

      delete user.hash_password;
      delete user.hashedRt;
      return {
        user: user,
        tokens: tokens,
      };
    } catch (error) {
      //verifies if this is an error from prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // verifies if this is an error generated from the unique constraint
        if (error.code === 'P2002') {
          throw new ForbiddenException('user already exists in the database');
        }
      }
      console.log(error);
      //if the error is not from prisma will generate an exception with a default message
      throw new ForbiddenException(
        'Could not sign the user up due to an error',
      );
    }
  }

  async SignWithOauth(dto: OauthDto) {
    try {
      const user = await this.prisma.oAuthUser.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        const new_user = await this.prisma.oAuthUser.create({
          data: {
            username: dto.username,
            provider: dto.provider,
            providerUserId: dto.providerUserId,
            email: dto.email,
            profile_image: dto.profile_image,
          },
        });
        const tokens = await this.getTokens(new_user.id, new_user.email);
        await this.updateRtOAuthHash(new_user.id, tokens.refresh_token);
        delete new_user.hashedRt;
        return {
          user: new_user,
          tokens: tokens,
        };
      } else {
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtOAuthHash(user.id, tokens.refresh_token);
        delete user.hashedRt;
        return {
          user: user,
          tokens: tokens,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  //returns the user with an access token, and reloads the refresh token
  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    const oauthExists = await this.prisma.oAuthUser.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user && !oauthExists)
      throw new NotFoundException('user was not found  in the database ');
    if (!user && oauthExists) throw new ForbiddenException('Wrong credentials');
    const match = await this.compareHash(dto.password, user.hash_password);
    if (!match) throw new ForbiddenException('Incorrect password');

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRtHash(user.id, tokens.refresh_token);
    delete user.hash_password;
    delete user.hashedRt;
    return {
      user: user,
      tokens: tokens,
    };
  }

  //deletes and invalidates the access token and refresh token, and stores the refresh token on the blacklist
  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  //refreshes the access token and refresh token
  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('user was not found');

    const rtMatches = await this.compareHash(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  //updates and hashes the refresh token on the database, returns the new refresh token
  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
  async updateRtOAuthHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.oAuthUser.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
  async refreshOAuthTokens(userId: string, rt: string) {
    const user = await this.prisma.oAuthUser.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('user was not found');

    const rtMatches = await this.compareHash(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  //hashes the inputed strings and returns it
  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  //compares two hashes and returns true if they are equal and false otherwise
  compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  //returns the access and refresh tokens
  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        { secret: 'at-secret', expiresIn: 60 * 15 },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        { secret: 'rt-secret', expiresIn: 60 * 20 * 24 * 7 },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
