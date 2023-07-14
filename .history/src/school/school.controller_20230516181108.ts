import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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

  @Get('/getschool/id=:id')
  getSchoolById(@Param('id') id: string) {
    return this.schoolService.getSchoolById(id);
  }
  @Get('/search_school')
  searchSchool(@Query('search_query') query: string) {
    return this.schoolService.searchSchool(query);
  }

  @Patch('/updateschool/:id')
  updateSchool() {}

  @Delete('/deleteschool/:id')
  deleteschool(@Param('id') id: string) {
    return this.schoolService.deleteSchool(id);
  }
}
