import { IsString } from 'class-validator';

export class CoordinateDto {
  @IsString()
  lat: String;

  @IsString()
  long: string;
}
