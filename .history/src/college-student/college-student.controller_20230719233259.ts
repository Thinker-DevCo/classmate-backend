import { Controller, Post } from '@nestjs/common';

@Controller('college-student')
export class CollegeStudentController {
  @Post('storeinfo')
  storeinfo() {}
}
