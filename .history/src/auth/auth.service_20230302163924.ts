import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { SignUpDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signUp(dto: SignUpDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash_password: dto.password,
          profile_image: dto.profile_image,
        },
      });

      return user;
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
}
