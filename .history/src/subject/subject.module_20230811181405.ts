import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { SubjectGateway } from './subject.gateway';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, SubjectGateway]
})
export class SubjectModule {}
