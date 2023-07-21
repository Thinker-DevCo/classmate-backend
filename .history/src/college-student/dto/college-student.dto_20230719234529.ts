import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CollegeStudentDTO {
  @IsString()
  @IsNotEmpty()
  courseId: String;

  @IsNumber()
  @IsNotEmpty()
  current_year: Number;

  @IsString()
  @IsOptional()
  userId?: String;

  @IsString()
  @IsOptional()
  oauthUserId?: String;
}
