import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CollegeStudentService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
}
