import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Validate,
  isString,
} from 'class-validator';

enum UserDType {
  APPOINTAMENTS = 'APPOINTAMENTS',
  TESTS = 'TESTS',
  EXERCISES = 'EXERCISES',
  EXAM = 'EXAM',
}

export class CreateUserDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsEnum(UserDType)
  @IsNotEmpty()
  type: UserDType;

  @IsUrl()
  @IsOptional()
  correctionUrl: string;

  @IsString()
  @IsOptional()
  subjectId?: string;

  @IsNumber()
  @IsOptional()
  year?: number;
}
