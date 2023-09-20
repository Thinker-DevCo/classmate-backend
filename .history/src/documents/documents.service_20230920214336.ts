import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonService } from 'src/lesson/lesson.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DocumentsService {
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
  };
  constructor(
    private readonly redis: RedisService,
    private prisma: PrismaService,
    private lessonService: LessonService,
  ) {}
  async filterByCourseSimilars(userId: string, quantity: number) {
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
    if (!user) return this.lessonService.findAll();
    const relation = user.course.name.split(' ');
    const lessons = await this.prisma.lesson.findMany({
      select: this.lessonSelect,
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
        createdAt: 'desc',
      },
      take: quantity,
    });

    if (!lessons)
      throw new NotFoundException('There are no assessments on the database');
    return lessons;
  }

  async findDocumentBySubjectName(subject: string, quantity?: number) {
    const lessons = await this.prisma.lesson.findMany({
      select: this.lessonSelect,
      where: {
        subject: {
          name: {
            contains: subject,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
    });
    const assessments = await this.prisma.assessment.findMany({
      select: this.lessonSelect,
      where: {
        subject: {
          name: {
            contains: subject,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
    });

    if (lessons && assessments) return [...lessons, ...assessments];

    if (!lessons && assessments) return assessments;

    if (lessons && !assessments) return assessments;

    throw new NotFoundException('There are no documents on the database');
  }

  async fetchByLastDocument() {
    const lesson = await this.prisma.assessment.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!lesson)
      throw new NotFoundException('There are no documents on the database');
  }
  async getLatestDocument() {
    const latestLesson = await this.prisma.lesson.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const latestAssessment = await this.prisma.assessment.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (latestLesson && latestAssessment) {
      return latestLesson.createdAt > latestAssessment.createdAt
        ? latestLesson
        : latestAssessment;
    } else if (latestLesson) {
      return latestLesson;
    } else if (latestAssessment) {
      return latestAssessment;
    }

    return null; // No documents found
  }
}
