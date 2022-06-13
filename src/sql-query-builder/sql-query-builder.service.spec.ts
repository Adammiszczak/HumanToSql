import { Test, TestingModule } from '@nestjs/testing';
import { SqlQueryBuilderService } from './sql-query-builder.service';

describe('SqlQueryBuilderService', () => {
  let service: SqlQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqlQueryBuilderService],
    }).compile();

    service = module.get<SqlQueryBuilderService>(SqlQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
