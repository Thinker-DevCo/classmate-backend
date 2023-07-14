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
  @ValidateIf((obj) => obj.location !== undefined)
  @ValidateNested()
  @IsOptional()
  location: CoordinateDto;

  @IsString()
  @IsOptional()
  address: string;
}
