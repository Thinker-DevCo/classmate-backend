import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { documentsTypes } from 'src/user-favorite-documents/@types/document';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async createList(dto: CreateListDto, userId: string) {
    try {
      const list = await this.prisma.lists.create({
        data: {
          name: dto.name,
          user_id: userId,
        },
      });
      return list;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('list information already exists');
        }
      }
    }
  }
  async listAssessment(list_id: string, assessment_Id: string) {
    console.log('lhe chamaram');
    try {
      const list = await this.prisma.listHasAssessment.create({
        data: {
          assessment_id: assessment_Id,
          list_id: list_id,
        },
      });
      return list;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'user personal information already exists',
          );
        }
      }
    }
  }
  async listLesson(list_id: string, lesson_Id: string) {
    try {
      const list = await this.prisma.listHasLesson.create({
        data: {
          lesson_id: lesson_Id,
          list_id: list_id,
        },
      });
      return list;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'user personal information already exists',
          );
        }
      }
    }
  }
  async listUserDocument(list_id: string, userDocument_Id: string) {
    try {
      const list = await this.prisma.listHasUserDocuments.create({
        data: {
          userDocument_id: userDocument_Id,
          list_id: list_id,
        },
      });
      return list;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'user personal information already exists',
          );
        }
      }
    }
  }

  async findAllLists(user_id: string) {
    const lists = await this.prisma.lists.findMany({
      select: {
        id: true,
        name: true,
        listHasAssessment: {
          select: {
            assessment_id: true,
          },
        },
        listHasUserDocuments: {
          select: {
            userDocument_id: true,
          },
        },
        listHasLesson: {
          select: {
            lesson_id: true,
          },
        },
      },
      where: {
        user_id: user_id,
      },
    });
    if (!lists) throw new NotFoundException('user has no lists');

    return lists;
  }

  async findOnelist(id: string, user_id) {
    const lists = await this.prisma.lists.findFirst({
      select: {
        id: true,
        name: true,
        listHasAssessment: {
          select: {
            assessment: {
              select: this.AssessmentSelect,
            },
          },
        },
        listHasUserDocuments: {
          select: {
            userDocument: true,
          },
        },
        listHasLesson: {
          select: {
            lesson: {
              select: this.lessonSelect,
            },
          },
        },
      },
      where: {
        AND: {
          id: id,
          user_id: user_id,
        },
      },
    });
    if (!lists) throw new NotFoundException('user has no lists');
    let assessments = [];
    let lessons = [];
    let userDocuments = [];
    lists.listHasAssessment.forEach(
      (doc) =>
        (assessments = [
          ...assessments,
          this.extractAssessmentFields(doc.assessment),
        ]),
    );
    lists.listHasLesson.forEach(
      (doc) => (lessons = [...lessons, this.extractLessonFields(doc.lesson)]),
    );
    lists.listHasUserDocuments.forEach(
      (doc) => (userDocuments = [...userDocuments, doc.userDocument]),
    );

    return {
      id: lists.id,
      name: lists.name,
      assessments: assessments,
      lessons: lessons,
      userDocuments: userDocuments,
    };
  }

  async updateList(id: string, updateListDto: UpdateListDto) {
    try {
      await this.prisma.lists.update({
        data: { ...updateListDto },
        where: {
          id: id,
        },
      });

      const message = { message: 'list deleted successfully', id: id };

      return message;
    } catch (err) {
      throw new ForbiddenException('Could not update personal information');
    }
  }

  async removeList(id: string) {
    try {
      await this.prisma.lists.delete({
        where: {
          id: id,
        },
      });

      const message = { message: 'userDocument deleted successfully', id: id };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'could not delete the userDocument information',
      );
    }
  }
  async removeAssessmentOnList(
    list_id: string,
    assessment_id: string,
    user_id: string,
  ) {
    try {
      await this.prisma.listHasAssessment.deleteMany({
        where: {
          AND: [
            {
              list_id: list_id,
              assessment_id: assessment_id,
            },
            {
              list: {
                user_id: user_id,
              },
            },
          ],
        },
      });

      const message = { message: 'assessment deleted successfully' };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'could not delete the assessment information',
      );
    }
  }
  async removeLessonOnList(
    list_id: string,
    lesson_id: string,
    user_id: string,
  ) {
    try {
      await this.prisma.listHasLesson.deleteMany({
        where: {
          AND: [
            {
              list_id: list_id,
              lesson_id: list_id,
            },
            {
              list: {
                user_id: user_id,
              },
            },
          ],
        },
      });

      const message = { message: 'lesson deleted successfully' };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'could not delete the assessment information',
      );
    }
  }
  async removeUserDocumentOnList(
    list_id: string,
    userdocument_id: string,
    user_id: string,
  ) {
    try {
      await this.prisma.listHasUserDocuments.deleteMany({
        where: {
          AND: [
            {
              list_id: list_id,
              userDocument_id: userdocument_id,
            },
            {
              list: {
                user_id: user_id,
              },
            },
          ],
        },
      });

      const message = { message: 'userdocument deleted successfully' };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'could not delete the assessment information',
      );
    }
  }
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
}
