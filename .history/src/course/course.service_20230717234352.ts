import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CourseDto } from './dto';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  storecourse(dto: CourseDto) {
    try {
      const user = this.prisma.course.create({
        data: {
          ...dto,
        },
      });
    } catch (err) {}
  }
}
