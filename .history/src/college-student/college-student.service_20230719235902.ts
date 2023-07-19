import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CollegeStudentDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CollegeStudentService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async storeInfo(dto: CollegeStudentDTO) {
    try {
      const student = await this.prisma.collegeStudentInfo.create({
        data: {
          ...dto,
        },
      });
      return student;
    } catch (err) {
      if (err.code instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'Student info already exists on the database',
          );
        }
      }
      console.log(err);
    }
  }
}
