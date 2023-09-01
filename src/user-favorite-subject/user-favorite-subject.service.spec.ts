import { Test, TestingModule } from '@nestjs/testing';
import { UserFavoriteSubjectService } from './user-favorite-subject.service';

describe('UserFavoriteSubjectService', () => {
  let service: UserFavoriteSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFavoriteSubjectService],
    }).compile();

    service = module.get<UserFavoriteSubjectService>(UserFavoriteSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
