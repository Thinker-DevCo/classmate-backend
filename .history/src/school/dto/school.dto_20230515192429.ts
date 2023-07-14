import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SchoolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsJSON()
  @IsOptional()
  location: string;
}
