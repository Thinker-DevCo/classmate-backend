import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: Number;

  @IsString()
  @IsNotEmpty()
  schoolId: string;
}
