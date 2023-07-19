import { Controller, Get } from '@nestjs/common';

@Controller('college-studentkad')
export class CollegeStudentController {
  @Get('student')
  getStudent() {}
}
