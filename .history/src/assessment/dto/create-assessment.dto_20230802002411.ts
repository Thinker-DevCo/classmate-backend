import {
  IsEnum,
  IsNotEmpty,
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
  type: string;

  @Validate((value) => {})
  period: string;
}

function isValidTestPeriod(value: any): boolean {
  if (value === AssessmentType.EXAM) {
    // Check if the value is one of the valid periods for exams (1, 2, or 3)
    return [
      AssessmentType.ONE,
      AssessmentType.TWO,
      AssessmentType.THREE,
    ].includes(value);
  }
  // Allow all values for tests and mini-tests
  return true;
}
