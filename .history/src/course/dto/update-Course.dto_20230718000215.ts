import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsNumber()
  @IsNotEmpty()
  duration?: number;

  @IsString()
  @IsNotEmpty()
  schoolId?: string;
}
