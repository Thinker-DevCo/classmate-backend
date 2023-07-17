import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto';

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

  @Get('/getCourse')
  getCourse() {}

  @Patch('/updateCourse')
  updateCourse() {}
}
