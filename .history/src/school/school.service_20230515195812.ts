import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { SchoolDto } from './dto';

@Injectable()
export class SchoolService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async storeSchool(dto: SchoolDto) {
    try {
      const school = this.prisma.school.create({
        data: {
          name: dto.name,
        },
      });
    } catch {}
  }
}
