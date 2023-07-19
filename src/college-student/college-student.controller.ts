import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CollegeStudentDTO } from './dto';
import { CollegeStudentService } from './college-student.service';
import { UpdateCollegeStudentDTO } from './dto/update-college-student.dto';

@Controller('college-student')
export class CollegeStudentController {
  constructor(private collegeStudentService: CollegeStudentService) {}
  @Post('/storeinfo')
  storeinfo(@Body() dto: CollegeStudentDTO) {
    return this.collegeStudentService.storeInfo(dto);
  }

  @Get('/getStudentInfoById/id=:id')
  getStudentInfoById(@Param('id') id: string) {
    return this.collegeStudentService.getStudentInfoById(id);
  }

  @Patch('/updateStudentInfo/id=:id')
  updateStudentInfo(
    @Param('id') id: string,
    @Body() dto: UpdateCollegeStudentDTO,
  ) {
    return this.updateStudentInfo(id, dto);
  }

  @Delete('/deleteStudentInfo/id=:id')
  deleteStudentInfo(@Param('id') id: string) {
    return this.deleteStudentInfo(id);
  }
}
