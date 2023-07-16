import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class OauthDto {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  providerUserId: string;

  @IsString()
  @IsOptional()
  profile_image?: string;
}
