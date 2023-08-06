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

enum AssessmentType {
  MINI_TEST = 'MINI_TEST',
  TEST = 'TEST',
  EXAM = 'EXAM',
  EXTRA = 'EXTRA',
}
enum AssessmentPeriod {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  EXTRA = 'EXTRA',
}
export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsEnum(AssessmentType)
  @IsNotEmpty()
  type: AssessmentType;

  @Validate((value) => isValidTestPeriod(value))
  period: AssessmentPeriod;

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

function isValidTestPeriod(value: any): boolean {
  if (value === AssessmentType.EXAM) {
    // Check if the value is one of the valid periods for exams (1, 2, or 3)
    return [
      AssessmentPeriod.ONE,
      AssessmentPeriod.TWO,
      AssessmentPeriod.THREE,
    ].includes(value);
  }
  if (value === AssessmentType.EXTRA) {
    return [AssessmentPeriod.EXTRA].includes(value);
  }
  // Allow all values for tests and mini-tests
  return true;
}
