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
import { AtGuard, PinfoGuard } from 'src/common/guards';
import { PersonaLInfoDto, UpdatePersonaLInfoDto } from './dto';

import { PersonalInfoService } from './personal-info.service';

@UseGuards(AtGuard)
@Controller('personal-info')
export class PersonalInfoController {
  constructor(private personalInfoService: PersonalInfoService) {}

  @Get('/getpersonalinfo')
  getUserPersonalInfo(@GetCurrentUserId() userId: string) {
    return this.personalInfoService.getUserPersonalInfo(userId);
  }

  @Post('/storepersonal')
  storePersonalInfo(
    @Body() dto: PersonaLInfoDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.personalInfoService.storePersonalInfo(dto, userId);
  }

  @Patch('updatepersonal')
  updatePersonalInfo(
    @Body() dto: UpdatePersonaLInfoDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.personalInfoService.updatePersonalInfo(dto, userId);
  }
}
