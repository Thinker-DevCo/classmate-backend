import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  async create(dto: CreateSubjectDto) {
    try {
      const subject = await this.prisma.subject.create({
        data: {
          name: dto.name,
          description: dto.description,
          semester: dto.semester,
          courseId: dto.courseId,
        },
        include: {
          course: true,
        },
      });

      return subject;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'Subject already exists in the database',
          );
        }
        throw new BadRequestException(
          'could not insert subject into the database',
        );
      }
    }
  }

  async findAll() {
    const cachedSubjects = await this.redis.get('subjects');
    if (cachedSubjects) return JSON.parse(cachedSubjects);

    const subjects = await this.prisma.subject.findMany({
      include: {
        course: true,
      },
    });
    if (!subjects)
      throw new NotFoundException('could not find any subject in the database');
    await this.redis.set('subjects', JSON.stringify(subjects), 'EX', 15);
    return subjects;
  }
  async filterbycourseandyear(userId: string) {
    const user = await this.prisma.collegeStudentInfo.findUnique({
      where: { userId: userId },
    });
    if (!user) throw new NotFoundException('user does not have college info');
    const year = user.current_year;
    const course = user.courseId;
    const subjects = await this.prisma.subject.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                semester: year * 2,
              },
              {
                semester: year * 2 - 1,
              },
            ],
          },
          {
            courseId: course,
          },
        ],
      },
      include: {
        course: true,
      },
    });
    if (!subjects)
      throw new NotFoundException('could not find any subject in the database');

    return subjects;
  }

  async findOne(id: string) {
    const cachedSubject = await this.redis.get('subject');
    if (cachedSubject) return JSON.parse(cachedSubject);
    const subject = await this.prisma.subject.findUnique({
      where: {
        id: id,
      },
      include: {
        course: true,
      },
    });
    if (!subject)
      throw new NotFoundException('subject was not found in the database');
    await this.redis.set('subject ', JSON.stringify(subject), 'EX', 15);
    return subject;
  }

  async findbyUsercourse(userId: string) {
    const user = await this.prisma.collegeStudentInfo.findUnique({
      where: { userId: userId },
    });
    if (!user) throw new NotFoundException('user does not have college info');
    const subjects = await this.prisma.subject.findMany({
      where: {
        courseId: user.courseId,
      },
    });
    if (!subjects)
      throw new NotFoundException('subject was not found in the database');
    return subjects;
  }
  async update(id: string, dto: UpdateSubjectDto) {
    try {
      const updatedSubject = await this.prisma.subject.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });

      return updatedSubject;
    } catch (err) {
      throw new BadRequestException('Could not update the subject information');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.subject.delete({
        where: {
          id: id,
        },
      });
      const message = { message: 'subject deleted successfully', id: id };

      return message;
    } catch (err) {
      throw new ForbiddenException('could not delete the subject');
    }
  }
}
