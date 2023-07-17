import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

  @Get('/getcourse/id=:id')
  getCourse(@Param('id') id: string) {
    return this.courseService.getCourselById(id);
  }

  @Patch('/updateCourse')
  updateCourse() {}
}
