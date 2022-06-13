import {
  Controller,
  Get,
  Render,
  Logger,
  Redirect,
  Post,
  Body,
} from '@nestjs/common';

@Controller('query')
export class QueryFormGuiController {
  constructor(
    private readonly logger = new Logger(QueryFormGuiController.name),
  ) {}

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
  @Redirect('query/form/result', 301)
  makeAnOrder(@Body() body) {
    try {
      this.logger.log(`xxx`);
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }
}
