import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CollegeStudentDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsNumber()
  @IsNotEmpty()
  current_year: number;
}
