import { Controller, Get, Render, Logger, Post, Body } from '@nestjs/common';
import { DatabaseEngineService } from 'src/database-engine/database-engine.service';
import { SqlQueryBuilderService } from './../sql-query-builder/sql-query-builder.service';

@Controller('query')
export class QueryFormGuiController {
  constructor(
    private readonly databaseEngineService: DatabaseEngineService,
    private readonly sqlQueryBuilderService: SqlQueryBuilderService,
  ) {}
  private readonly logger = new Logger(QueryFormGuiController.name);

  @Get('form')
  @Render('form1')
  renderForm() {
    return;
  }

  @Get('form/result')
  @Render('queryResult')
  sendQueryResult() {
    return;
  }

  @Post('process')
  async makeQueryToDb(@Body() body) {
    try {
      const rawQuery = this.sqlQueryBuilderService.prepareRawSqlQuery(
        body.givenQuery,
      );
      const response = await this.databaseEngineService.makeRawQuery(rawQuery);
      console.log(JSON.parse(response)[0]);
      return JSON.parse(response)[0];
    } catch (error) {
      this.logger.error(error);
      return error.message;
    }
  }
}
