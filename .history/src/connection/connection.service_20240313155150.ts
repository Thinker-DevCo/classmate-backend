import { Injectable } from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}
  async create(createConnectionDto: CreateConnectionDto) {
    await this.prisma.connection.create({
      data: {
        senderId,
        receiverId,
        status: 'pending',
      },
    });
  }

  findAll() {
    return `This action returns all connection`;
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
