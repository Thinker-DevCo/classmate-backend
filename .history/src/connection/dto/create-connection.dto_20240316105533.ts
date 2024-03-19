import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum Status {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
}

export class CreateConnectionDto {
  @IsString()
  @IsNotEmpty()
  receiver_id: string;
}
