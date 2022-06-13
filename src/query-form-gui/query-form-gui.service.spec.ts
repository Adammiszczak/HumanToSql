import { Test, TestingModule } from '@nestjs/testing';
import { QueryFormGuiService } from './query-form-gui.service';

describe('QueryFormGuiService', () => {
  let service: QueryFormGuiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryFormGuiService],
    }).compile();

    service = module.get<QueryFormGuiService>(QueryFormGuiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
