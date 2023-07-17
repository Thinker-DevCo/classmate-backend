import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class updateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  schoolId: string;
}
