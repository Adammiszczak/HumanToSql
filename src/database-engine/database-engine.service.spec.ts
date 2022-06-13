import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseEngineService } from './database-engine.service';

describe('DatabaseEngineService', () => {
  let service: DatabaseEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseEngineService],
    }).compile();

    service = module.get<DatabaseEngineService>(DatabaseEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
