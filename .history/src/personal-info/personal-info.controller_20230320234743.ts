import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { PinfoGuard } from 'src/common/guards';
import { PersonaLInfoDto } from './dto';

import { PersonalInfoService } from './personal-info.service';

@Controller('personal-info')
export class PersonalInfoController {
  constructor(private personalInfoService: PersonalInfoService) {}

  @UseGuards(PinfoGuard)
  @Get('/getpersonalinfo')
  getUserPersonalInfo(@GetCurrentUserId() userId: string) {
    return this.personalInfoService.getUserPersonalInfo(userId);
  }

  @UseGuards(PinfoGuard)
  @Post()
  storePersonalInfo(
    @Body() dto: PersonaLInfoDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.personalInfoService.storePersonalInfo(dto, userId);
  }

  @Patch()
  updatePersonalInfo() {}
}
