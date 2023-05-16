import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { CoordinateDto } from './coordinate.dto';
export class SchoolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsJSON()
  location: {
    lat: number;
    long: number;
  };

  @IsString()
  @IsOptional()
  address: string;
}
