import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserFavoriteSubjectDto } from './dto/create-user-favorite-subject.dto';
import { UpdateUserFavoriteSubjectDto } from './dto/update-user-favorite-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserFavoriteSubjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

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
      return favorite;
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

  async findAll(userid: string) {
    const cachedfavorites = await this.redis.get('favorites');
    if (cachedfavorites) return JSON.parse(cachedfavorites);
    const favorites = await this.prisma.userFavoriteSubject.findMany({
      where: {
        userId: userid,
      },
      include: {
        subject: true,
      },
    });
    if (!favorites)
      throw new NotFoundException(
        'This user does not have any favorite subject',
      );
    await this.redis.set('favorites', JSON.stringify(favorites), 'EX', 15);
    return favorites;
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

  async remove(userId: string, subjectID: string) {
    try {
      await this.prisma.userFavoriteSubject.delete({
        where: {
          AND: [
            {
              subjectId: subjectID,
            },
            {
              userId: userId,
            },
          ],
        },
      });
    } catch (error) {}
  }
}
