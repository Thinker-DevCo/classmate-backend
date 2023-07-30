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
import { CourseService } from './course.service';
import { CourseDto, UpdateCourseDto } from './dto';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post('/storecourse')
  storecourse(@Body() dto: CourseDto) {
    return this.courseService.storecourse(dto);
  }

  @Get('/getallcourses')
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get('/getcourse/id=:id')
  getCourse(@Param('id') id: string) {
    return this.courseService.getCourselById(id);
  }

  @Patch('/updatecourse/id=:id')
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.updateCourse(id, dto);
  }

  @Get('/searchcourse')
  searchCourse(@Query('seach_query') query: string) {
    return this.courseService.searchCourse(query);
  }

  @Get('/querybyschoolname')
  queryCoursesBySchoolName(@Query('school_name') query: string) {
    return this.queryCoursesBySchoolName(query);
  }

  @Delete('/deletecourse/id=:id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
