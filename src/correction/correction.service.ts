import { Injectable } from '@nestjs/common';
import { CreateCorrectionDto } from './dto/create-correction.dto';
import { UpdateCorrectionDto } from './dto/update-correction.dto';

@Injectable()
export class CorrectionService {
  create(createCorrectionDto: CreateCorrectionDto) {
    return 'This action adds a new correction';
  }

  findAll() {
    return `This action returns all correction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} correction`;
  }

  update(id: number, updateCorrectionDto: UpdateCorrectionDto) {
    return `This action updates a #${id} correction`;
  }

  remove(id: number) {
    return `This action removes a #${id} correction`;
  }
}
