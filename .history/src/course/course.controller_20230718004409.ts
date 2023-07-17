import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  @Delete('/deletecourse/id=:id')
  deleteCourse(@Param('id')) {
    return this.courseService.deleteCourse(id)
  }
}
