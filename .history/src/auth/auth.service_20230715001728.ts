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
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  //returns the user, an access token and a refresh token
  async signUp(dto: SignUpDto) {
    try {
      let hash;
      if (!dto.isOAuth) {
        hash = await this.hashData(dto.password);
      } else {
        hash = await this.hashData(this.generateRandomPassword());
      }
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

  //returns the user with an access token, and reloads the refresh token
  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user)
      throw new NotFoundException('user was not found  in the database ');
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
  generateRandomPassword(length: number = 16): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_';
    const charLength = characters.length;

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charLength);
      password += characters.charAt(randomIndex);
    }

    return password;
  }
}
