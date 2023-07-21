import { Controller, Get } from '@nestjs/common';

@Controller('college-student')
export class CollegeStudentController {
  @Get('student')
  getStudent() {}
}
