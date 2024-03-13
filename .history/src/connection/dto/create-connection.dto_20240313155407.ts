import { IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsString()
  sender_id: string;

  @IsString()
  receiver_id: string;
}
