import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './@types';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OauthDto } from './dto/oauth.dto';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  //returns the user, an access token and a refresh token
  async signUp(dto: SignUpDto) {
    try {
      const hash = await this.hashData(dto.password);
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

  async findOrCreateOauthUser(dto: OauthDto) {
    let user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          provider: dto.provider,
          providerUserId: dto.providerUserId,
          profile_image: dto.profile_image,
        },
      });

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      delete user.hash_password, delete user.hashedRt;

      return {
        user: user,
        tokens: tokens,
      };
    }

    if (user.hash_password) {
      await this.prisma.user.update({
        where: {
          email: dto.email,
        },
        data: {
          profile_image: dto.profile_image,
        },
      });
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    delete user.hash_password, delete user.hashedRt;

    return {
      user: user,
      tokens: tokens,
    };
  }
  //returns the user with an access token, and reloads the refresh token
  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (user.provider && user.providerUserId)
      throw new UnauthorizedException('wrong credentials ');
    console.log(
      'this is the hashed password: ',
      await this.hashData(dto.password),
    );
    console.log('this is the hashed password in the db: ', user.hash_password);
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
    try {
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
      return { message: 'User successfully logged out' };
    } catch (err) {
      throw new InternalServerErrorException('failed to logut');
    }
  }

  //refreshes the access token and refresh token
  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('user was not found');
    // console.log(user.hashedRt);
    // console.log(await this.hashData(rt));
    const providedHashedRt = await this.hashData(rt);

    const rtMatches = await this.compareHash(rt, user.hashedRt);
    const receivedHashedToken = await this.hashData(rt);
    console.log('Received Hashed Token:', receivedHashedToken);
    console.log('Database Hashed Token:', user.hashedRt);

    if (!rtMatches) throw new ForbiddenException('Access denied');
    console.log('Refresh Token Matches:', rtMatches);
    const tokens = await this.getTokens(user.id, user.email);

    console.log(await this.hashData(tokens.refresh_token));
    console.log(await this.hashData(tokens.refresh_token));
    // console.log(
    //   await bcrypt.compare(
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZGMxNTUyZS0zNThmLTRmYzYtODgwYy0yYzZmMTFlZjQ3OGMiLCJlbWFpbCI6ImtlbHZpbjEwMEBnbWFpbC5jb20iLCJpYXQiOjE2OTMzMTE4OTIsImV4cCI6MTY5MzUxMzQ5Mn0.GyEoDqubvcDiPZx_GoU1ZLtDDcAjV9525rlml7gRd2k',
    //     await this.hashData(tokens.refresh_token),
    //   ),
    // );
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

  //hashes the inputed strings and returns it
  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  //compares two hashes and returns true if they are equal and false otherwise
  compareHash(salt: string, hash: string): Promise<boolean> {
    return bcrypt.compare(salt, hash);
  }

  //returns the access and refresh tokens
  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        { secret: 'at-secret', expiresIn: 60 },
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
  setTokensCookies(res: Response, tokens: Tokens) {
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 1000),
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 1000 * 20 * 24 * 7),
    });
  }
}
