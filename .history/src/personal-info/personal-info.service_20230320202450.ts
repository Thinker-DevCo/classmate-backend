import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PersonalInfoService {
  constructor(private prisma: PrismaService) {}

  async getUserPersonalInfo() {}

  async StorePersonalInf() {}
}
