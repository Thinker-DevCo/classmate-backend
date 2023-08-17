import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFavoriteSubjectDto } from './create-user-favorite-subject.dto';

export class UpdateUserFavoriteSubjectDto extends PartialType(CreateUserFavoriteSubjectDto) {}
