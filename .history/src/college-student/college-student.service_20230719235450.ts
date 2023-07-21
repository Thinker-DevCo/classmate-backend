import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CollegeStudentDTO } from './dto';

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
    } catch (err) {}
  }
}
