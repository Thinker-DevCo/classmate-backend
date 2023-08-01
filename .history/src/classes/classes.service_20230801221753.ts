import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassesService {

  constructor(private readonly redis: RedisService, private prisma: PrismaService){
    
  }

  async create(createClassDto: CreateClassDto) {
    try {
      const Class = 
      return 'This action adds a new class';
    } catch (err) {}
  }

  findAll() {
    return `This action returns all classes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
