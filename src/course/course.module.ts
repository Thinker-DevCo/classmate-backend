import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseGateway } from './course.gateway';

@Module({
  providers: [CourseService, CourseGateway],
  controllers: [CourseController],
})
export class CourseModule {}
