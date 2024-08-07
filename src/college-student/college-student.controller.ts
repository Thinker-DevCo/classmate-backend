import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CollegeStudentDTO } from './dto';
import { CollegeStudentService } from './college-student.service';
import { UpdateCollegeStudentDTO } from './dto/update-college-student.dto';
import { AtStrategy } from 'src/auth/strategies';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';

@Controller({
  version: '1',
  path: 'college-student',
})
export class CollegeStudentController {
  constructor(private collegeStudentService: CollegeStudentService) {}

  @UseGuards(AtGuard)
  @Post('/storeinfo')
  storeinfo(
    @GetCurrentUserId() userId: string,
    @Body() dto: CollegeStudentDTO,
  ) {
    return this.collegeStudentService.storeInfo(userId, dto);
  }

  @UseGuards(AtGuard)
  @Get('/getStudentInfoById')
  getStudentInfoById(@GetCurrentUserId() id: string) {
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
