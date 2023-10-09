import { Module } from '@nestjs/common';
import { UserFavoriteDocementsService } from './user-favorite-documents.service';
import { UserFavoriteDocementsController } from './user-favorite-documents.controller';

@Module({
  controllers: [UserFavoriteDocementsController],
  providers: [UserFavoriteDocementsService],
})
export class UserFavoriteDocementsModule {}
