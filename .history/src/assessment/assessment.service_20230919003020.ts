import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssessmentService {
  constructor(
    private readonly redis: RedisService,
    private prisma: PrismaService,
  ) {}
  async create(dto: CreateAssessmentDto) {
    try {
      const assessment = await this.prisma.assessment.create({
        data: {
          ...dto,
        },
      });
      return assessment;
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
    const cachedAssessments = await this.redis.get('assessments');
    if (cachedAssessments) return JSON.parse(cachedAssessments);
    const assessments = await this.prisma.assessment.findMany();
    if (!assessments)
      throw new NotFoundException('Could not find any assessment');
    await this.redis.set('assessments', JSON.stringify(assessments), 'EX', 15);
    return assessments;
  }

  async findOne(id: string) {
    const cachedAssessment = await this.redis.get('assessment');
    if (cachedAssessment) return JSON.parse(cachedAssessment);
    const assessment = await this.prisma.assessment.findUnique({
      where: {
        id: id,
      },
    });
    if (!assessment) throw new NotFoundException('Could not find assessment');
    await this.redis.set('assessment', JSON.stringify(assessment), 'EX', 15);
    return assessment;
  }

  async update(id: string, dto: UpdateAssessmentDto) {
    try {
      const assessment = await this.prisma.assessment.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });

      return assessment;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'could not update the assessment information',
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.assessment.delete({
        where: {
          id: id,
        },
      });

      const message = { message: 'assessment deleted successfully', id: id };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'could not delete the assessment information',
      );
    }
  }

  async queryAssessments() {
    const cachedAssessments = await this.redis.get('assessments');
    if (cachedAssessments) return JSON.parse(cachedAssessments);
    const assessments = await this.prisma.assessment.findMany({
      select: {
        title: true,
        url: true,
        type: true,
        period: true,
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
      },
    });
    if (!assessments) throw new NotFoundException('Could not find any lessons');
    await this.redis.set('assessments', JSON.stringify(assessments), 'EX', 15);
    return assessments;
  }
  async filterByCourseSimilars(userId: string) {
    const user = await this.prisma.collegeStudentInfo.findUnique({
      select: {
        course: {
          select: {
            name: true,
          },
        },
      },
      where: {
        userId: userId,
      },
    });
    if (!user) return this.queryAssessments();
    const relation = user.course.name.split(' ');
    const assessments = await this.prisma.assessment.findMany({
      where: {
        subject: {
          course: {
            OR: relation.map((word) => ({
              name: {
                contains: word,
              },
            })),
          },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }
}
