import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  descritption: string;

  @IsNumber()
  @IsOptional()
  semester?: number;

  @IsString()
  @IsNotEmpty()
  courseId: string;
}