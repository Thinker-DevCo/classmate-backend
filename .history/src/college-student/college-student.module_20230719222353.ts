import { Module } from '@nestjs/common';
import { CollegeStudentService } from './college-student.service';
import { CollegeStudentController } from './college-student.controller';

@Module({
  providers: [CollegeStudentService],
  controllers: [CollegeStudentController],
})
export class CollegeStudentModule {}
