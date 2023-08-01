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
    const lessons = await this.prisma.lesson.findMany();
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

  update(id: number, updateClassDto: UpdateLessonDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
