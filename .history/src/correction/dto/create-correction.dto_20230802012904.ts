import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCorrectionDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
