import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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
          description: dto.descritpion,
          semester: dto.semester,
          courseId: dto.courseId,
        },
        include: {
          course: true,
        },
      });
      this.redis.publish('subjectCreated', JSON.stringify(subject));
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
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
