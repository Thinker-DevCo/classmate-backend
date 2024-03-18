import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDocumentDto } from './dto/create-user-document.dto';
import { UpdateUserDocumentDto } from './dto/update-user-document.dto';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserDocumentsService {
  constructor(
    private readonly redis: RedisService,
    private prisma: PrismaService,
  ) {}
  async create(dto: CreateUserDocumentDto) {
    try {
      const userDocument = await this.prisma.userDocument.create({
        data: {
          ...dto,
        },
      });
      return userDocument;
    } catch (err) {
      if (err.code instanceof Prisma.PrismaClientInitializationError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'This file already exists in the database',
          );
        }
      }
      console.log(err);
      throw new BadRequestException('Error storing the file in the database');
    }
  }

  findAll() {
    return `This action returns all userDocuments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userDocument`;
  }

  update(id: number, updateUserDocumentDto: UpdateUserDocumentDto) {
    return `This action updates a #${id} userDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} userDocument`;
  }
}
