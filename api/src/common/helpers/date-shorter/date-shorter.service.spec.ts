import { Test, TestingModule } from '@nestjs/testing';
import { DateShorterService } from './date-shorter.service';

describe('DateShorterService', () => {
  let service: DateShorterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateShorterService],
    }).compile();

    service = module.get<DateShorterService>(DateShorterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
