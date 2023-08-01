import { Module } from '@nestjs/common';
import { CorrectionService } from './correction.service';
import { CorrectionController } from './correction.controller';

@Module({
  controllers: [CorrectionController],
  providers: [CorrectionService]
})
export class CorrectionModule {}
