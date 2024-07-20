import { Test, TestingModule } from '@nestjs/testing';
import { QuotidiensService } from './quotidiens.service';

describe('QuotidiensService', () => {
  let service: QuotidiensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotidiensService],
    }).compile();

    service = module.get<QuotidiensService>(QuotidiensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
