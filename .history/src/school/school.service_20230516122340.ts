import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { SchoolDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchoolService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async storeSchool(dto: SchoolDto) {
    try {
      const school = await this.prisma.school.create({
        data: {
          ...dto,
        },
      });
      return school;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('school already exists');
        }
      }
      console.log(err);
      throw new ForbiddenException('Could not create personal information');
    }
  }
}
