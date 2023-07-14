import { IsJSON, IsOptional, IsString } from 'class-validator';

class updateSchoolDto {
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
