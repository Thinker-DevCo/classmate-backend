import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
// import { CollegeStudentDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CollegeStudentService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  //   async storeInfo(dto: CollegeStudentDTO) {
  //     try {
  //       const collegeStudent = await this.prisma.collegeStudentInfo.create({
  //         data: {
  //           ...dto,
  //         },
  //       });
  //       return collegeStudent;
  //     } catch (err) {
  //       if (err.code === Prisma.PrismaClientKnownRequestError) {
  //         if (err.code === 'P2002') {
  //           throw new ForbiddenException('user information already exists');
  //         }
  //       }
  //     }
  //   }
}
