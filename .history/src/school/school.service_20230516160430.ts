import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getAllSchools() {
    const cachedSchools = await this.redis.get('schools');
    if (cachedSchools) return JSON.parse(cachedSchools);
    const schools = await this.prisma.school.findMany();

    if (!schools)
      throw new NotFoundException('could not find any school information');

    return schools;
  }

  async getSchoolById(id: string) {
    const cachedSchool = await this.redis.get('school');
    if (cachedSchool) return JSON.parse(cachedSchool);

    const school = await this.prisma.school.findUnique({
      where: {
        id: id,
      },
    });

    if (!school)
      throw new NotFoundException('could not find school information');

    return school;
  }

  async searchSchool(query: string) {
    const search_result = await this.prisma.school.findMany({
      where: {
        full_name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return search_result;
  }
}
