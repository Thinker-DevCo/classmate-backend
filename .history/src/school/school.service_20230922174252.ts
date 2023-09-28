import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { SchoolDto, UpdateSchoolDto } from './dto';
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
      throw new ForbiddenException('Could not create school');
    }
  }

  async getAllSchools() {
    const cachedSchools = await this.redis.get('schools');
    if (cachedSchools) return JSON.parse(cachedSchools);
    const schools = await this.prisma.school.findMany();

    if (!schools)
      throw new NotFoundException('could not find any school information');
    await this.redis.set('schools', JSON.stringify(schools), 'EX', 15);
    return schools;
  }

  async getSchoolById(id: string) {
    const cachedSchool = await this.redis.get('school');
    if (cachedSchool) return JSON.parse(cachedSchool);

    const school = await this.prisma.school.findUnique({
      where: {
        id: id,
      },
      include: {
        course: true,
      },
    });

    if (!school)
      throw new NotFoundException('could not find school information');

    return school;
  }

  async searchSchool(query: string) {
    const search_result = await this.prisma.school.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            acronime: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return search_result;
  }

  async updateSchool(id: string, dto: UpdateSchoolDto) {
    try {
      const school = await this.prisma.school.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });

      return school;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('could not update the user information');
    }
  }

  async deleteSchool(id: string) {
    try {
      await this.prisma.school.delete({
        where: {
          id: id,
        },
      });
      const message = {
        message: `school with id ${id} deleted successfully`,
        id: id,
      };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('school could not be deleted');
    }
  }
}
