import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

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
      });
      this.redis.publish('subjectCreated', JSON.stringify(subject));
    } catch (err) {}
  }

  findAll() {
    return `This action returns all subject`;
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
