import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
enum ClassType {
  EXERCISE = 'EXERCISE',
  APPOINTAMENTS = 'APPOINTAMENTS',
}
export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsUrl()
  @IsOptional()
  correctionUrl?: string;
  @IsEnum(ClassType)
  @IsNotEmpty()
  classType: ClassType;

  @IsString()
  @IsOptional()
  subjectId: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  author?: string;
}
