import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
enum ClassType {
  EXERCISE = 'EXERCISE',
  APPOINTAMENTS = 'APPOINTAMENTS',
}
export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsEnum(ClassType)
  @IsNotEmpty()
  classType: ClassType;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  author?: string;
}
