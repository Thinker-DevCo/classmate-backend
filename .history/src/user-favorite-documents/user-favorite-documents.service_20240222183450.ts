import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserFavoriteDocementDto } from './dto/create-user-favorite-docement.dto';
import { UpdateUserFavoriteDocementDto } from './dto/update-user-favorite-docement.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { Prisma } from '@prisma/client';
import { documentsTypes } from './@types/document';

@Injectable()
export class UserFavoriteDocumentsService {
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
  async createLesson(user_Id: string, lesson_id: string) {
    try {
      const lesson = await this.prisma.userFavoriteLesson.create({
        data: {
          user_id: user_Id,
          lesson_id: lesson_id,
        },
      });
      return lesson;
    } catch (err) {
      if (err.code instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('lesson is already users favorite');
        }
      }

      throw new ForbiddenException('Could not add lesson to favorite table');
    }
  }
  async createAssessment(user_id: string, assessment_id: string) {
    try {
      const assessment = await this.prisma.userFavoriteAssessment.create({
        data: {
          user_id: user_id,
          assessment_id: assessment_id,
        },
      });
      return assessment;
    } catch (err) {
      if (err.code instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('assessment is already users favorite');
        }
      }

      throw new ForbiddenException(
        'Could not add assessment to favorite table',
      );
    }
  }
  async findAll(user_id: string) {
    const favoriteLesson = await this.prisma.userFavoriteLesson.findMany({
      select: {
        lesson: {
          select: this.lessonSelect,
        },
      },
      where: {
        user_id: user_id,
      },
    });
    const favoriteAssessment =
      await this.prisma.userFavoriteAssessment.findMany({
        select: {
          Assessment: {
            select: this.AssessmentSelect,
          },
        },
        where: {
          user_id: user_id,
        },
      });
    if (!favoriteLesson && !favoriteAssessment)
      throw new NotFoundException('user does not have any favorite documents');
    if (!favoriteLesson && favoriteAssessment)
      return favoriteAssessment.map((item) =>
        this.extractAssessmentFields(item.Assessment),
      );
    if (favoriteLesson && !favoriteAssessment)
      return favoriteLesson.map((item) =>
        this.extractLessonFields(item.lesson),
      );

    return [
      ...favoriteAssessment.map((item) =>
        this.extractAssessmentFields(item.Assessment),
      ),
      ...favoriteLesson.map((item) => this.extractLessonFields(item.lesson)),
    ];
  }

  async removeLesson(user_id: string, lesson_id: string) {
    try {
      await this.prisma.userFavoriteLesson.delete({
        where: {
          user_id_lesson_id: {
            user_id: user_id,
            lesson_id: lesson_id,
          },
        },
      });

      const message = {
        message: 'lesson removed from favorite successfully',
        id: lesson_id,
      };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'lesson could not be removed from favorite',
      );
    }
  }

  async removeAssessment(user_id: string, assessment_id: string) {
    try {
      await this.prisma.userFavoriteAssessment.delete({
        where: {
          user_id_assessment_id: {
            user_id: user_id,
            assessment_id: assessment_id,
          },
        },
      });

      const message = {
        message: 'assessment remove from favorite',
        id: assessment_id,
      };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'assessment could not be removed from favorite',
      );
    }
  }
}
