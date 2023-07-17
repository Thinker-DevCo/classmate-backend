import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  storecourse() {}
}
