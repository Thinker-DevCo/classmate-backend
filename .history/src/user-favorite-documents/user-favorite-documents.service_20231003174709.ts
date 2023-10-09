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

@Injectable()
export class UserFavoriteDocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
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
          select: {
            id: true,
            title: true,
            url: true,
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
          },
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
            select: {
              id: true,
              title: true,
              url: true,
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
            },
          },
        },
        where: {
          user_id: user_id,
        },
      });
    if (!favoriteLesson && !favoriteAssessment)
      throw new NotFoundException('user does not have any favorite documents');
    if (!favoriteLesson && favoriteAssessment) return [...favoriteAssessment];
    if (favoriteLesson && !favoriteAssessment) return [...favoriteLesson];

    return [...favoriteAssessment, favoriteLesson];
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
