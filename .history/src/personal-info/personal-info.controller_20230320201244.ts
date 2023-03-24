import { Controller, Get, Post } from '@nestjs/common';

@Controller('personal-info')
export class PersonalInfoController {
  @Get()
  getPersonalInfo() {}

  @Post()
  storePersonalInfo() {}
}
