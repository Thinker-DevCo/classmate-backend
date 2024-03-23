import { IsEnum, IsString } from 'class-validator';

enum AssessmentPeriod {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export class CreateListDto {
  @IsString()
  name: string;

  @IsEnum()
  access;
}
