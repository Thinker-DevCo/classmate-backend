import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CourseDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async storecourse(dto: CourseDto) {
    try {
      const course = await this.prisma.course.create({
        data: {
          ...dto,
        },
      });
      return course;
    } catch (err) {
      if (err.code instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Course already exists in the database');
        }
      }
      console.log(err);
      throw new ForbiddenException('Could not create school');
    }
  }
}
