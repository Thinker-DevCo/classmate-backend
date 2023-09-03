import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolDto, UpdateSchoolDto } from './dto';
import { AtGuard } from 'src/common/guards';

@Controller({ path: 'school', version: '1' })
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Post('/storeschool')
  storeSchool(@Body() dto: SchoolDto) {
    return this.schoolService.storeSchool(dto);
  }
  @UseGuards(AtGuard)
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

  @Patch('/updateschool/id=:id')
  updateSchool(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolService.updateSchool(id, dto);
  }

  @Delete('/deleteschool/id=:id')
  deleteschool(@Param('id') id: string) {
    return this.schoolService.deleteSchool(id);
  }
}
