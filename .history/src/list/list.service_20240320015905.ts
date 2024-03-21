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
            assessment: true,
          },
        },
        listHasUserDocuments: {
          select: {
            userDocument: true,
          },
        },
        listHasLesson: {
          select: {
            lesson: true,
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
            assessment: true,
          },
        },
        listHasUserDocuments: {
          select: {
            userDocument: true,
          },
        },
        listHasLesson: {
          select: {
            lesson: true,
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

    return lists;
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
}
