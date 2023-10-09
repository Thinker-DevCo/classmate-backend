import { Module } from '@nestjs/common';
import { UserFavoriteDocementsService } from './user-favorite-docements.service';
import { UserFavoriteDocementsController } from './user-favorite-docements.controller';

@Module({
  controllers: [UserFavoriteDocementsController],
  providers: [UserFavoriteDocementsService]
})
export class UserFavoriteDocementsModule {}
