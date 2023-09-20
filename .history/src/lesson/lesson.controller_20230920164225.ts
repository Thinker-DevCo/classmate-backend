import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller({ version: '1', path: 'lessons' })
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('/storelesson')
  create(@Body() createClassDto: CreateLessonDto) {
    return this.lessonService.create(createClassDto);
  }

  @Get('/getalllessons')
  findAll() {
    return this.lessonService.findAll();
  }

  @Get('getlessonbyid/id=:id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch('/updatelesson/id=:id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateLessonDto) {
    return this.lessonService.update(id, updateClassDto);
  }

  @Delete('/deletelesson/id=:id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
