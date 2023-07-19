import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CollegeStudentDTO {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsNumber()
  @IsNotEmpty()
  current_year: number;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  oauthUserId?: string;
}
