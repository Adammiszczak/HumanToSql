import { Injectable } from '@nestjs/common';
import knex from 'knex';
import { ConfigService } from '@nestjs/config';
import { SqlQueryBuilderService } from 'src/sql-query-builder/sql-query-builder.service';

// custom error

@Injectable()
export class DatabaseEngineService {
  constructor(private configService: ConfigService) {}

  private connectToDB() {
    return knex({
      client: 'mysql',
      connection: {
        port: 3308,
        host: 'localhost',
        user: this.configService.get<string>('DB_USER'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: this.configService.get<string>('DB_NAME'),
      },
    });
  }

  public async getAllRecords(tableName: string) {
    // try catch
    const db = this.connectToDB();
    return db
      .select()
      .from(tableName)
      .then((rows) => {
        const rowsToJSON = JSON.stringify(rows);
        db.destroy();
        return rowsToJSON;
      });
  }

  public async makeRawQuery(query: string) {
    console.log({ query });
    const db = this.connectToDB();
    return db.raw(query).then((rows) => {
      const rowsToJSON = JSON.stringify(rows);
      console.log({ rowsToJSON });
      db.destroy();
      return rowsToJSON;
    });
  }

  // public makeRawSqlQuery() {}
}
