import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateCorrectionDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
