import { Gender, Province } from '@prisma/client';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdatePersonaLInfoDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(Province)
  @IsOptional()
  province?: Province;

  @IsDate()
  @IsOptional()
  birth_date?: Date;
}
