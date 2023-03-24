import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNegative,
  IsOptional,
  IsString,
} from 'class-validator';
import { Province } from '@prisma/client';
import { Gender } from '@prisma/client';

export class PersonaLInfoDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(Province)
  @IsOptional()
  province?: Province;

  @IsDateString()
  birth_date: Date;
}
