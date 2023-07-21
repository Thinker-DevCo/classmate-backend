import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CollegeStudentDTO } from './dto';
import { Prisma } from '@prisma/client';
import { UpdateCollegeStudentDTO } from './dto/update-college-student.dto';

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

  async getStudentInfoById(id: string) {
    const cachedStudentInfo = await this.redis.get('studentInfo');
    if (cachedStudentInfo) return JSON.parse(cachedStudentInfo);
    const studentInfo = await this.prisma.collegeStudentInfo.findFirst({
      where: {
        OR: [
          {
            oauthUserId: id,
          },
          {
            userId: id,
          },
        ],
      },
      include: {
        course: true,
        user: true,
        oAuthUser: true,
      },
    });
    if (!studentInfo)
      throw new NotFoundException('could not find student info');
    await this.redis.set('studentInfo', JSON.stringify(studentInfo), 'EX', 15);
    return studentInfo;
  }

  async updateStudentInfo(id: string, dto: UpdateCollegeStudentDTO) {
    try {
      const studentInfo = await this.prisma.collegeStudentInfo.updateMany({
        where: {
          OR: [
            {
              userId: id,
            },
            {
              oauthUserId: id,
            },
          ],
        },
        data: {
          ...dto,
        },
      });
      return studentInfo;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Failed to update student info');
    }
  }
}
