import { Controller, Get, Post } from '@nestjs/common';

@Controller('course')
export class CourseController {
  @Post('/storecourse')
  storecourse() {}

  @Get('/getAllCourses')
  getAllCourses() {}

  @Get('/getCourse')
  getCourse() {}

  @Patch('/updateCourse')
  updateCourse() {}
}
