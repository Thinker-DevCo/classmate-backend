import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CorrectionService } from './correction.service';
import { CreateCorrectionDto } from './dto/create-correction.dto';
import { UpdateCorrectionDto } from './dto/update-correction.dto';

@Controller('correction')
export class CorrectionController {
  constructor(private readonly correctionService: CorrectionService) {}

  @Post()
  create(@Body() createCorrectionDto: CreateCorrectionDto) {
    return this.correctionService.create(createCorrectionDto);
  }

  @Get()
  findAll() {
    return this.correctionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.correctionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCorrectionDto: UpdateCorrectionDto) {
    return this.correctionService.update(+id, updateCorrectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.correctionService.remove(+id);
  }
}
