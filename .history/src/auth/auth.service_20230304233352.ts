import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto';
import { Tokens } from './@types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        { secret: '', expiresIn: 60 * 15 },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        { secret: '', expiresIn: 60 * 15 },
      ),
    ]);
  }
  async signUp(dto: SignUpDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash_password: hash,
          profile_image: dto.profile_image,
        },
      });

      return;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('user already exists in the database');
      }
      throw new ForbiddenException(
        'Could not sign the user up due to an error: ',
        error,
      );
    }
  }

  async signIn() {}

  async logout() {}

  async refreshTokens() {}
}