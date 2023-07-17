import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CourseDto, UpdateCourseDto } from './dto';
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
  async getAllCourses() {
    const cachedCourses = await this.redis.get('courses');
    if (cachedCourses) return JSON.parse(cachedCourses);
    const courses = await this.prisma.course.findMany({
      include: {
        school: true,
      },
    });

    if (!courses)
      throw new NotFoundException('could not find any course information');
    await this.redis.set('courses', JSON.stringify(courses), 'EX', 15);
    return courses;
  }

  async getCourselById(id: string) {
    const cachedCourse = await this.redis.get('course');
    if (cachedCourse) return JSON.parse(cachedCourse);

    const course = await this.prisma.course.findUnique({
      where: {
        id: id,
      },
      include: {
        school: true,
      },
    });

    if (!course)
      throw new NotFoundException('could not find school information');
    await this.redis.set('course', JSON.stringify(course), 'EX', 15);
    return course;
  }
  async updateCourse(id: string, dto: UpdateCourseDto) {
    try {
      const course = await this.prisma.course.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });
      return course;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('could not update the course information');
    }
  }
  async deleteCourse(id: string) {
    try {
      await this.prisma.course.delete({
        where: {
          id: id,
        },
      });
      return { message: 'course deleted successfully' };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('course could not be deleted');
    }
  }
}
