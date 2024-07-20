import { Test, TestingModule } from '@nestjs/testing';
import { QuotidiensController } from './quotidiens.controller';
import { QuotidiensService } from './quotidiens.service';

describe('QuotidiensController', () => {
  let controller: QuotidiensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotidiensController],
      providers: [QuotidiensService],
    }).compile();

    controller = module.get<QuotidiensController>(QuotidiensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
