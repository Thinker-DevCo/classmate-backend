import { Test, TestingModule } from '@nestjs/testing';
import { CorrectionController } from './correction.controller';
import { CorrectionService } from './correction.service';

describe('CorrectionController', () => {
  let controller: CorrectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorrectionController],
      providers: [CorrectionService],
    }).compile();

    controller = module.get<CorrectionController>(CorrectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
