import { Test, TestingModule } from '@nestjs/testing';
import { RevuesController } from './revues.controller';
import { RevuesService } from './revues.service';

describe('RevuesController', () => {
  let controller: RevuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevuesController],
      providers: [RevuesService],
    }).compile();

    controller = module.get<RevuesController>(RevuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
