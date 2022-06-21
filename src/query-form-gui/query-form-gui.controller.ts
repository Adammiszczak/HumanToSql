import {
  Controller,
  Get,
  Render,
  Logger,
  Redirect,
  Post,
  Body,
} from '@nestjs/common';
import { DatabaseEngineService } from 'src/database-engine/database-engine.service';
import { ConfigService } from '@nestjs/config';
import { SqlQueryBuilderService } from './../sql-query-builder/sql-query-builder.service';
// custom error
@Controller('query')
export class QueryFormGuiController {
  constructor(
    private readonly databaseEngineService: DatabaseEngineService,
    private readonly sqlQueryBuilderService: SqlQueryBuilderService,
    private configService: ConfigService,
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
  // @Redirect('query/form/result', 301)
  async makeQueryToDb(@Body() body) {
    try {
      const rawQuery = this.sqlQueryBuilderService.prepareRawSqlQuery(
        body.givenQuery,
      );
      console.log('Controller Done');
      const response = await this.databaseEngineService.makeRawQuery(rawQuery);
      console.log(JSON.parse(response)[0]);
      return JSON.parse(response)[0];
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }
}
