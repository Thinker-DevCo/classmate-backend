import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  profile_image: string;

  @IsBoolean()
  verified_email: boolean;

  @Exclude({ toPlainOnly: true })
  @IsString()
  hash_password: string;
}
