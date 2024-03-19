import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}
  async sendConnnection(sender_id: string, receiver_id: string) {
    try {
      const connection = await this.prisma.connection.findFirst({
        where: {
          receiver_id: sender_id,
        },
      });
      if (connection) throw new ForbiddenException('connection already exists');
      await this.prisma.connection.create({
        data: {
          sender_id: sender_id,
          receiver_id: receiver_id,
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

  async acceptConnectionRequest(sender_id: string, receiver_id: string) {
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
  async getUserConnections(userId: string) {
    let processedConnections = [];
    const connections = await this.prisma.connection.findMany({
      select: {
        sender: true,
        receiver: true,
        status: true,
      },
      where: {
        OR: [
          { sender_id: userId, status: 'ACCEPTED' },
          { receiver_id: userId, status: 'ACCEPTED' },
        ],
      },
    });
    if (!connections)
      throw new NotFoundException('user does not have connections');

    connections.forEach((connection) => {
      if (connection.sender.id == userId) {
        processedConnections = [
          ...processedConnections,
          { user: connection.sender, status: connection.status },
        ];
      } else {
        processedConnections = [
          ...processedConnections,
          { user: connection.receiver, status: connection.status },
        ];
      }
    });
    return processedConnections;
  }
  async rejectConnection(sender_id: string, receiver_id: string) {
    try {
      await this.prisma.connection.delete({
        where: {
          sender_id_receiver_id: {
            sender_id: sender_id,
            receiver_id: receiver_id,
          },
        },
      });
    } catch (err) {
      throw new BadRequestException('could not reject connection');
    }
  }
}
