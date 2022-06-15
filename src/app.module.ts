import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryFormGuiController } from './query-form-gui/query-form-gui.controller';
import { QueryFormGuiService } from './query-form-gui/query-form-gui.service';
import { SqlQueryBuilderService } from './sql-query-builder/sql-query-builder.service';
import { DatabaseEngineService } from './database-engine/database-engine.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, QueryFormGuiController],
  providers: [
    AppService,
    QueryFormGuiService,
    SqlQueryBuilderService,
    DatabaseEngineService,
  ],
})
export class AppModule {}
