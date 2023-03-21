import { Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('personal-info')
export class PersonalInfoController {
  @Get()
  getUserPersonalInfo() {}

  @Post()
  storePersonalInfo() {}

  @Patch()
  updatePersonalInfo() {}
}
