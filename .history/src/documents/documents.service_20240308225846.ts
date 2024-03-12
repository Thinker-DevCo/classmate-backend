import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonService } from 'src/lesson/lesson.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { documentsTypes } from 'src/user-favorite-documents/@types/document';

@Injectable()
export class DocumentsService {
  private lessonSelect = {
    id: true,
    title: true,
    url: true,
    summary: true,
    classType: true,
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
  private AssessmentSelect = {
    id: true,
    title: true,
    url: true,
    type: true,
    period: true,
    year: true,
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
  extractLessonFields = (document: documentsTypes) => ({
    id: document.id,
    title: document.title,
    url: document.url,
    subject_name: document.subject.name,
    course_name: document.subject.course.name,
    school_acronime: document.subject.course.school.acronime,
    school_logo: document.subject.course.school.logo,
    summary: document.summary,
    classType: document.classType,
  });
  extractAssessmentFields = (document: documentsTypes) => ({
    id: document.id,
    title: document.title,
    url: document.url,
    subject_name: document.subject.name,
    course_name: document.subject.course.name,
    school_acronime: document.subject.course.school.acronime,
    school_logo: document.subject.course.school.logo,
    type: document.type,
    year: document.year,
    period: document.period,
  });
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
      throw new NotFoundException('There are no lessons on the database');
    return lessons.map((item) => this.extractLessonFields(item));
  }

  async findDocumentBySubjectId(subjectId: string, quantity?: number) {
    const lessons = await this.prisma.lesson.findMany({
      select: this.lessonSelect,
      where: {
        subject: {
          id: subjectId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
    });
    const assessments = await this.prisma.assessment.findMany({
      select: this.AssessmentSelect,
      where: {
        subject: {
          id: subjectId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
    });

    if (lessons && assessments)
      return [
        ...lessons.map((item) => this.extractLessonFields(item)),
        ...assessments.map((item) => this.extractAssessmentFields(item)),
      ];

    if (!lessons && assessments)
      return assessments.map((item) => this.extractAssessmentFields(item));

    if (lessons && !assessments)
      return lessons.map((item) => this.extractLessonFields(item));

    throw new NotFoundException('There are no documents on the database');
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
      select: this.AssessmentSelect,
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

    if (lessons && assessments)
      return [
        ...lessons.map((item) => this.extractLessonFields(item)),
        ...assessments.map((item) => this.extractAssessmentFields(item)),
      ];

    if (!lessons && assessments)
      return assessments.map((item) => this.extractAssessmentFields(item));

    if (lessons && !assessments)
      return lessons.map((item) => this.extractLessonFields(item));

    throw new NotFoundException('There are no documents on the database');
  }

  async fetchByLastDocument(quantity: number) {
    const latest = await this.getLatestDocument();
    if (!latest)
      throw new NotFoundException('There are no documents on the database');
    const lessons = await this.prisma.lesson.findMany({
      select: this.lessonSelect,
      where: {
        subjectId: latest.subjectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
    });
    const assessments = await this.prisma.assessment.findMany({
      select: this.AssessmentSelect,
      where: {
        subjectId: latest.subjectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
    });
    if (lessons && assessments)
      return [
        ...lessons.map((item) => this.extractLessonFields(item)),
        ...assessments.map((item) => this.extractAssessmentFields(item)),
      ];

    if (!lessons && assessments)
      return assessments.map((item) => this.extractAssessmentFields(item));

    if (lessons && !assessments)
      return lessons.map((item) => this.extractLessonFields(item));

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
