import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDocumentDto } from './dto/create-user-document.dto';
import { UpdateUserDocumentDto } from './dto/update-user-document.dto';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserDocumentsService {
  constructor(
    private readonly redis: RedisService,
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
  });
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

  async findAll() {
    const documents = await this.prisma.userDocument.findMany();
    if (!documents)
      throw new NotFoundException('Could not find any assessment');

    return documents;
  }

  async findOne(id: string) {
    const document = await this.prisma.assessment.findUnique({
      where: {
        id: id,
      },
    });
    if (!document) throw new NotFoundException('Could not find document');

    return document;
  }

  async update(id: string, dto: UpdateUserDocumentDto) {
    try {
      const documents = await this.prisma.userDocument.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });

      return documents;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'could not update the assessment information',
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.userDocument.delete({
        where: {
          id: id,
        },
      });

      const message = { message: 'userDocument deleted successfully', id: id };

      return message;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'could not delete the userDocument information',
      );
    }
  }
}
