import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { LessonService } from 'src/lesson/lesson.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, LessonService],
})
export class DocumentsModule {}
