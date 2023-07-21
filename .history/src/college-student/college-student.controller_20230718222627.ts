import { Body, Controller, Post } from '@nestjs/common';
import { CollegeStudentService } from './college-student.service';
import { CollegeStudentDTO } from './dto';

@Controller('college-student')
export class CollegeStudentController {
  constructor(private collegStudentService: CollegeStudentService) {}

  // @Post('/storeinfo')
  // storeInfo(@Body() dto: CollegeStudentDTO) {
  //   return this.collegStudentService.storeInfo(dto);
  // }
}
