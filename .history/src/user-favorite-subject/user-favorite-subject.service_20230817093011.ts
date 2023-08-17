import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserFavoriteSubjectDto } from './dto/create-user-favorite-subject.dto';
import { UpdateUserFavoriteSubjectDto } from './dto/update-user-favorite-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserFavoriteSubjectService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, subjectId: string) {
    try {
      const favorite = this.prisma.userFavoriteSubject.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          subject: {
            connect: {
              id: subjectId,
            },
          },
        },
      });
    } catch (err) {
      if (err.code instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'subject is already exists in the database',
          );
        }
      }
      console.log(err);
      throw new ForbiddenException('Could not create school');
    }
  }

  findAll() {
    return `This action returns all userFavoriteSubject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFavoriteSubject`;
  }

  update(
    id: number,
    updateUserFavoriteSubjectDto: UpdateUserFavoriteSubjectDto,
  ) {
    return `This action updates a #${id} userFavoriteSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFavoriteSubject`;
  }
}
