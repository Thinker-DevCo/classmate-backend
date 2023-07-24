import { Test, TestingModule } from '@nestjs/testing';
import { SchoolGateway } from './school.gateway';

describe('SchoolGateway', () => {
  let gateway: SchoolGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolGateway],
    }).compile();

    gateway = module.get<SchoolGateway>(SchoolGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
