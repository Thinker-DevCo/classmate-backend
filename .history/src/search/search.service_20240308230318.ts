import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { documentsTypes } from 'src/user-favorite-documents/@types/document';
import { LessonType } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
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

  async findAll(query: string) {
    console.log('here');
    const subjects = await this.findSubjects(query);
    const lessons = await this.findLessons(query);
    const assessments = await this.findAssessments(query);

    return {
      documents: [
        ...lessons.map((lesson) => this.extractLessonFields(lesson)),
        ...assessments.map((assessment) =>
          this.extractAssessmentFields(assessment),
        ),
      ],
      subjects: [...subjects],
    };

    // const cursos = await t;
    return `This action returns all search`;
  }

  async findSubjects(query: string) {
    const subjects = await this.prisma.subject.findMany({
      where: {
        OR: [
          {
            assessments: {
              every: {
                title: {
                  contains: query,
                },
              },
            },
          },
          {
            name: {
              contains: query,
            },
          },
          {
            lessons: {
              every: {
                OR: [
                  {
                    title: {
                      contains: query,
                    },
                  },
                  {
                    summary: {
                      contains: query,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    });
    return subjects;
  }

  async findLessons(query: string) {
    const lesson = await this.prisma.lesson.findMany({
      select: this.lessonSelect,
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            summary: {
              contains: query,
            },
          },
        ],
      },
    });
    return lesson;
  }

  async findAssessments(query: string) {
    const assessments = await this.prisma.assessment.findMany({
      select: this.AssessmentSelect,
      where: {
        OR: {
          title: {
            contains: query,
          },
        },
      },
    });
    return assessments;
  }
  // async findCourses(query: string) {

  //   const assessments = await this.prisma.assessment.findMany({
  //     where: {
  //       OR: {
  //         title: {
  //           contains: query,
  //         },
  //       },
  //     },
  //   });
  //   return assessments
  // }
}
