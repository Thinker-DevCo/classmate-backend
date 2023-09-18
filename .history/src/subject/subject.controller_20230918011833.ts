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
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

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
  @UseGuards(AtGuard)
  @Get('/filterbycourseandyear')
  filterbycourseandyear(@GetCurrentUserId() userId: string) {
    return this.subjectService.filterbycourseandyear(userId);
  }

  @UseGuards(AtGuard)
  @Get('findbycourse')
  findbycourse(@GetCurrentUserId() userId: string) {
    return;
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
