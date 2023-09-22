import { IsString } from 'class-validator';

export class CreateUserFavoriteSubjectDto {
  @IsString()
  subjectId: string;
}
