import { Test, TestingModule } from '@nestjs/testing';
import { DentistsController } from './dentists.controller';
import { DentistsService } from './dentists.service';

describe('DentistsController', () => {
  let controller: DentistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DentistsController],
      providers: [DentistsService],
    }).compile();

    controller = module.get<DentistsController>(DentistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
