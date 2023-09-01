import { Module } from '@nestjs/common';
import { UserFavoriteSubjectService } from './user-favorite-subject.service';
import { UserFavoriteSubjectController } from './user-favorite-subject.controller';

@Module({
  controllers: [UserFavoriteSubjectController],
  providers: [UserFavoriteSubjectService]
})
export class UserFavoriteSubjectModule {}
