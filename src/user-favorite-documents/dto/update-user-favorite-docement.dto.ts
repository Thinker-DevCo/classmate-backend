import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFavoriteDocementDto } from './create-user-favorite-docement.dto';

export class UpdateUserFavoriteDocementDto extends PartialType(CreateUserFavoriteDocementDto) {}
