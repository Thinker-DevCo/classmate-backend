import { Module } from '@nestjs/common';
import { PersonalInfoService } from './personal-info.service';
import { PersonalInfoController } from './personal-info.controller';

@Module({
  providers: [PersonalInfoService],
  controllers: [PersonalInfoController]
})
export class PersonalInfoModule {}
