import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserFavoriteDocementDto } from './dto/create-user-favorite-docement.dto';
import { UpdateUserFavoriteDocementDto } from './dto/update-user-favorite-docement.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserFavoriteDocementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  create(createUserFavoriteDocementDto: CreateUserFavoriteDocementDto) {
    return 'This action adds a new userFavoriteDocement';
  }

  async findAll(user_id: string) {
    const favoriteLesson = await this.prisma.userFavoriteLesson.findMany({
      include: { lesson: true },
      where: {
        user_id: user_id,
      },
    });
    const favoriteAssessment =
      await this.prisma.userFavoriteAssessment.findMany({
        include: {
          Assessment: true,
        },
        where: {
          user_Id: user_id,
        },
      });
    if (!favoriteLesson && !favoriteAssessment)
      throw new NotFoundException('user does not have any favorite documents');
    if (!favoriteLesson && favoriteAssessment) return [...favoriteAssessment];
    if (favoriteLesson && !favoriteAssessment) return [...favoriteLesson];

    return [...favoriteAssessment, favoriteLesson];
  }

  findOne(id: number) {
    return `This action returns a #${id} userFavoriteDocement`;
  }

  update(
    id: number,
    updateUserFavoriteDocementDto: UpdateUserFavoriteDocementDto,
  ) {
    return `This action updates a #${id} userFavoriteDocement`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFavoriteDocement`;
  }
}
