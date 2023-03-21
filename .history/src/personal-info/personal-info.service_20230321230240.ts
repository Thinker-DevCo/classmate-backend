import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonaLInfoDto, UpdatePersonaLInfoDto } from './dto';

@Injectable()
export class PersonalInfoService {
  constructor(private prisma: PrismaService) {}

  async getUserPersonalInfo(id: string) {
    const personalInfo = this.prisma.personalInfo.findUnique({
      where: {
        user_id: id,
      },
    });

    if (!personalInfo)
      throw new NotFoundException(
        'User does not have his personal information stored',
      );

    return personalInfo;
  }

  async storePersonalInfo(dto: PersonaLInfoDto, userId: string) {
    try {
      const personalInfo = await this.prisma.personalInfo.create({
        data: {
          user_id: userId,
          first_name: dto.first_name,
          last_name: dto.last_name,
          birth_date: new Date(dto.birth_date),
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
    } catch (err) {
      throw new ForbiddenException('Could not update personal information');
    }
  }
}
