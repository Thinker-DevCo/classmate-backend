import { Controller, Post } from '@nestjs/common';
import { CollegeStudentService } from './college-student.service';

@Controller('college-student')
export class CollegeStudentController {
  constructor(private collegStudentService: CollegeStudentService) {}

  @Post('/storeinfo')
  storeInfo() {}
}
