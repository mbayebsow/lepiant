import { Test, TestingModule } from '@nestjs/testing';
import { AverageColorService } from './average-color.service';

describe('AverageColorService', () => {
  let service: AverageColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AverageColorService],
    }).compile();

    service = module.get<AverageColorService>(AverageColorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
