import { Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { PinfoGuard } from '../../src/common/guards/personalInfo.guard';
import { PersonalInfoService } from './personal-info.service';

@Controller('personal-info')
export class PersonalInfoController {
  constructor(private personalInfoService: PersonalInfoService) {}

  @UseGuards(PinfoGuard)
  @Get('/getpersonalinfo')
  getUserPersonalInfo(@GetCurrentUserId() userId: string) {
    return this.personalInfoService.getUserPersonalInfo(userId);
  }

  @Post()
  storePersonalInfo() {}

  @Patch()
  updatePersonalInfo() {}
}
