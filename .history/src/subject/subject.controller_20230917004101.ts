import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller({ path: 'subject', version: '1' })
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('/createsubject')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get('/findallsubjects')
  findAll() {
    return this.subjectService.findAll();
  }

  @Get('/findsubject/id=:id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(id);
  }
  @Get('/filterbycourseandyear')
  filterbycourseandyear(
    @Query('year') year: string,
    @Query('courseId') courseId: string,
  ) {
    return this.subjectService.filterbycourseandyear(+year, courseId);
  }

  @Patch('updatesubject/id=:id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete('deletesubject/id=:id')
  remove(@Param('id') id: string) {
    return this.subjectService.remove(id);
  }
}
