import { IsJSON, IsOptional, IsString } from 'class-validator';

export class UpdateSchoolDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  acronime?: string;

  @IsJSON()
  @IsOptional()
  location?: {
    lat: number;
    long: number;
  };

  @IsString()
  @IsOptional()
  address?: string;
}
