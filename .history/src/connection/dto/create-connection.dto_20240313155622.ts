import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum Status {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
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
