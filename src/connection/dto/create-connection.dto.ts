import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum Status {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
}
export class CreateConnectionDto {
  @IsString()
  @IsNotEmpty()
  sender_id: string;

  @IsString()
  @IsNotEmpty()
  receiver_id: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
