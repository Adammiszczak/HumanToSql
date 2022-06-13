import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseEngineController } from './database-engine.controller';

describe('DatabaseEngineController', () => {
  let controller: DatabaseEngineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseEngineController],
    }).compile();

    controller = module.get<DatabaseEngineController>(DatabaseEngineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
