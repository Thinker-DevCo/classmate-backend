import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}
  async create(createConnectionDto: CreateConnectionDto) {
    try {
      await this.prisma.connection.create({
        data: {
          sender_id: createConnectionDto.sender_id,
          receiver_id: createConnectionDto.receiver_id,
          status: 'PENDING',
        },
      });
    } catch (err) {
      if (err.code instanceof Prisma.PrismaClientInitializationError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('This user is already connected ');
        }
      }
      console.log(err);
      throw new BadRequestException('Error storing the file in the database');
    }
  }

  async acceptConnectionRequest(sender_id, receiver_id) {
    try {
      const connection = await this.prisma.connection.findUnique({
        where: {
          sender_id_receiver_id: {
            sender_id: sender_id,
            receiver_id: receiver_id,
          },
        },
      });
      if (connection.status == 'PENDING') {
        await this.prisma.connection.update({
          where: {
            sender_id_receiver_id: {
              sender_id: sender_id,
              receiver_id: receiver_id,
            },
          },
          data: { status: 'ACCEPTED' },
        });
        return {
          message: 'connection accepted',
        };
      } else {
        throw new ForbiddenException('Connection is already processed');
      }
    } catch (err) {
      throw new BadRequestException(
        'could not change the connection status to Accepted',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} connection`;
  }

  update(id: number, updateConnectionDto: UpdateConnectionDto) {
    return `This action updates a #${id} connection`;
  }

  remove(id: number) {
    return `This action removes a #${id} connection`;
  }
}
