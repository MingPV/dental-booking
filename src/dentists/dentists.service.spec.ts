import { Test, TestingModule } from '@nestjs/testing';
import { DentistsService } from './dentists.service';

describe('DentistsService', () => {
  let service: DentistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DentistsService],
    }).compile();

    service = module.get<DentistsService>(DentistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
