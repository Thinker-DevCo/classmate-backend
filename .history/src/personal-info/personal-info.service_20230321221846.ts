import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonaLInfoDto } from './dto';

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
    const personalInfo = await this.prisma.personalInfo.create({
      data: {
        user_id: userId,
        ...dto,
      },
    });
  }

  async updatePersonalInfo() {}
}
