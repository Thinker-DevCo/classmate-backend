import { ForbiddenException, Injectable } from '@nestjs/common';
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
  async createAssessment(list_id: string, assessment_Id: string) {
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
  findAll() {
    return `This action returns all list`;
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
