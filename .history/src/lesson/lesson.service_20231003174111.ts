import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LessonService {
  private lessonSelect = {
    id: true,
    title: true,
    url: true,
    subject: {
      select: {
        name: true,
        course: {
          select: {
            name: true,
            school: {
              select: {
                logo: true,
                acronime: true,
              },
            },
          },
        },
      },
    },
    favoriteLessons: true,
  };

  constructor(
    private readonly redis: RedisService,
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateLessonDto) {
    try {
      const newClass = await this.prisma.lesson.create({
        data: { ...dto },
      });

      return newClass;
    } catch (err) {
      if (err.code instanceof Prisma.PrismaClientInitializationError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'This file already exists in the database',
          );
        }
      }
      console.log(err);
      throw new BadRequestException('Error storing the file in the database');
    }
  }

  async findAll() {
    const cachedClasses = await this.redis.get('lessons');
    if (cachedClasses) return JSON.parse(cachedClasses);
    const lessons = await this.prisma.lesson.findMany({
      select: this.lessonSelect,
    });

    if (!lessons) throw new NotFoundException('Could not find any lessons');
    await this.redis.set('lessons', JSON.stringify(lessons), 'EX', 15);
    return lessons;
  }

  async findOne(id: string) {
    const cachedLesson = await this.redis.get('lesson');
    if (cachedLesson) return JSON.parse(cachedLesson);
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: id,
      },
    });
    if (!lesson) throw new NotFoundException('Could not find any lesson');
    await this.redis.set('lesson', JSON.stringify(lesson), 'EX', 15);
    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto) {
    try {
      const lesson = await this.prisma.lesson.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });

      return lesson;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('could not update the lesson information');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.lesson.delete({
        where: {
          id: id,
        },
      });

      const message = { message: 'lesson deleted successfully', id: id };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('could not delete the lesson information');
    }
  }
}
