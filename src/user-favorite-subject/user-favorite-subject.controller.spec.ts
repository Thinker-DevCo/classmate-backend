import { Test, TestingModule } from '@nestjs/testing';
import { UserFavoriteSubjectController } from './user-favorite-subject.controller';
import { UserFavoriteSubjectService } from './user-favorite-subject.service';

describe('UserFavoriteSubjectController', () => {
  let controller: UserFavoriteSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFavoriteSubjectController],
      providers: [UserFavoriteSubjectService],
    }).compile();

    controller = module.get<UserFavoriteSubjectController>(UserFavoriteSubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
