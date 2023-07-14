import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolDto } from './dto';

@Controller('school')
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Post('/storeschool')
  storeSchool(@Body() dto: SchoolDto) {
    return this.schoolService.storeSchool(dto);
  }

  @Get('/getallschools')
  getAllSchools() {
    return this.schoolService.getAllSchools();
  }

  @Get('/getschool/:id')
  getSchoolById(@Param('id') id: string) {
    return this.schoolService.getSchoolById(id);
  }
}
