import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PersonalInfoService } from './personal-info.service';

@Controller('personal-info')
export class PersonalInfoController {
  constructor(private personalInfoService: PersonalInfoService) {}
  @Get('/getpersonalinfo/:id')
  getUserPersonalInfo(@Param('id') userid: string) {
    return this.personalInfoService.getUserPersonalInfo(userid);
  }

  @Post()
  storePersonalInfo() {}

  @Patch()
  updatePersonalInfo() {}
}
