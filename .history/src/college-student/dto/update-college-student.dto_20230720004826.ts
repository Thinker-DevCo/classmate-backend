import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCollegeStudentDTO {
  @IsString()
  @IsOptional()
  courseId?: string;

  @IsNumber()
  @IsOptional()
  current_year?: number;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  oauthUserId?: string;
}
