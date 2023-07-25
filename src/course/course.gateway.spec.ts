import { Test, TestingModule } from '@nestjs/testing';
import { CourseGateway } from './course.gateway';

describe('CourseGateway', () => {
  let gateway: CourseGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseGateway],
    }).compile();

    gateway = module.get<CourseGateway>(CourseGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
