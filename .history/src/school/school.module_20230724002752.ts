import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { SchoolGateway } from './school.gateway';

@Module({
  providers: [SchoolService, SchoolGateway],
  controllers: [SchoolController]
})
export class SchoolModule {}
