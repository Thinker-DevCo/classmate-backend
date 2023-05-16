import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolDto } from './dto';

@Controller('school')
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Post('/storeschool')
  storeSchool(@Body() dto: SchoolDto) {
    return this.schoolService.storeSchool(dto);
  }

  @Get()
  getAllSchools() {}

  @Get()
  getSchoolById() {}

  @Get()
  getSchoolByname() {}

  @Patch()
  updateSchool() {}

  @Delete()
  deleteSchool() {}
}
