import { Test, TestingModule } from '@nestjs/testing';
import { RadiosService } from './radios.service';

describe('RadiosService', () => {
  let service: RadiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RadiosService],
    }).compile();

    service = module.get<RadiosService>(RadiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
