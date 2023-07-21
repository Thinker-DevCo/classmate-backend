import { Module } from '@nestjs/common';
import { CollegeStudentController } from './college-student.controller';
import { CollegeStudentService } from './college-student.service';

@Module({
  controllers: [CollegeStudentController],
  providers: [CollegeStudentService]
})
export class CollegeStudentModule {}
