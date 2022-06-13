import { Test, TestingModule } from '@nestjs/testing';
import { QueryFormGuiController } from './query-form-gui.controller';

describe('QueryFormGuiController', () => {
  let controller: QueryFormGuiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueryFormGuiController],
    }).compile();

    controller = module.get<QueryFormGuiController>(QueryFormGuiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
