import { IsArray, IsString } from 'class-validator';

export class CreateUserFavoriteSubjectDto {
  @IsArray()
  subjectId: string[];
}
