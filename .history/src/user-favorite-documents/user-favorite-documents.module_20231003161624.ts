import { Module } from '@nestjs/common';
import { UserFavoriteDocumentsService } from './user-favorite-documents.service';
import { UserFavoriteDocumentsController } from './user-favorite-documents.controller';

@Module({
  controllers: [UserFavoriteDocumentsController],
  providers: [UserFavoriteDocumentsService],
})
export class UserFavoriteDocumentsModule {}
