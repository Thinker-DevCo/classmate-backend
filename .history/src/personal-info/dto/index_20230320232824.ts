import {
  IsDate,
  IsEnum,
  IsNegative,
  IsOptional,
  IsString,
} from 'class-validator';

enum Province {
  MAPUTO,
  MAPUTO_CIDADE,
  GAZA,
  INHAMBANE,
  SOFALA,
  MANICA,
  TETE,
  NAMPULA,
  ZAMBEZIA,
  NIASSA,
  CABO_DELGADO,
}

enum Gender {
  MALE,
  FEMALE,
  NOT_SPECIFIED,
}
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

  @IsDate()
  birth_date: Date;
}
