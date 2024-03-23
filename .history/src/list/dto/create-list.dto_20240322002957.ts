import { IsEnum, IsString } from 'class-validator';

enum AccessType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export class CreateListDto {
  @IsString()
  name: string;
}
