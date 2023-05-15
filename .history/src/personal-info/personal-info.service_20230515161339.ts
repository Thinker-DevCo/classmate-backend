import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonaLInfoDto, UpdatePersonaLInfoDto } from './dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PersonalInfoService {
  constructor(private prisma: PrismaService, private redis: RedisService) {}
  async getUserPersonalInfo(id: string) {
    const cachedInfo = await this.redis.get('PersonalInfo');
    if (!cachedInfo) {
      const personalInfo = this.prisma.personalInfo.findUnique({
        where: {
          user_id: id,
        },
      });

      if (!personalInfo)
        throw new NotFoundException(
          'User does not have his personal information stored',
        );

      await this.redis.set(
        'PersonalInfo',
        JSON.stringify(personalInfo),
        'EX',
        15,
      );
      return personalInfo;
    }

    return JSON.parse(cachedInfo);
  }

  async storePersonalInfo(dto: PersonaLInfoDto, userId: string) {
    try {
      const personalInfo = await this.prisma.personalInfo.create({
        data: {
          user_id: userId,
          first_name: dto.first_name,
          last_name: dto.last_name,
          birth_date: new Date(dto.birth_date),
          gender: dto.gender,
          province: dto.province,
        },
      });

      return personalInfo;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'user personal information already exists',
          );
        }
      }
      console.log(err);
      throw new ForbiddenException('Could not create personal information');
    }
  }

  async updatePersonalInfo(dto: UpdatePersonaLInfoDto, userId: string) {
    try {
      await this.prisma.personalInfo.update({
        where: {
          user_id: userId,
        },
        data: {
          ...dto,
        },
      });
      return {
        message: 'user info was updated successfully',
      };
    } catch (err) {
      throw new ForbiddenException('Could not update personal information');
    }
  }
}
