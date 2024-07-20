import { Test, TestingModule } from '@nestjs/testing';
import { RevuesService } from './revues.service';

describe('RevuesService', () => {
  let service: RevuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevuesService],
    }).compile();

    service = module.get<RevuesService>(RevuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
