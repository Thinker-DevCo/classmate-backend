import { Test, TestingModule } from '@nestjs/testing';
import { SubjectGateway } from './subject.gateway';

describe('SubjectGateway', () => {
  let gateway: SubjectGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectGateway],
    }).compile();

    gateway = module.get<SubjectGateway>(SubjectGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
