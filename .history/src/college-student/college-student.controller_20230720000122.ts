import { Body, Controller, Post } from '@nestjs/common';
import { CollegeStudentDTO } from './dto';
import { CollegeStudentService } from './college-student.service';

@Controller('college-student')
export class CollegeStudentController {
  constructor(private collegeStudentService: CollegeStudentService) {}
  @Post('/storeinfo')
  storeinfo(@Body() dto: CollegeStudentDTO) {
    return this.collegeStudentService.storeInfo(dto);
  }
}
