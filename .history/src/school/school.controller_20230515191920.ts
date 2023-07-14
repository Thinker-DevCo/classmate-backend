import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { SchoolService } from './school.service';

@Controller('school')
export class SchoolController {
  constructor(private schoolService: SchoolService) {}
  @Post()
  storeSchool() {}
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
