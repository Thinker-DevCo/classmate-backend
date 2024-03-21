import {
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

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
