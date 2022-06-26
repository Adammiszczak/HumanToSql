import { Injectable, Logger } from '@nestjs/common';
import knex from 'knex';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseEngineService {
  constructor(private configService: ConfigService) {}
  private readonly logger = new Logger(DatabaseEngineService.name);

  public async makeRawQuery(query: string) {
    const db = this.connectToDB();
    return db.raw(query).then((rows) => {
      const rowsToJSON = JSON.stringify(rows);
      db.destroy();
      return rowsToJSON;
    });
  }

  private connectToDB() {
    try {
      return knex({
        client: 'mysql',
        connection: {
          port: this.configService.get<number>('DB_PORT'),
          host: this.configService.get<string>('DB_HOST'),
          user: this.configService.get<string>('DB_USER'),
          password: this.configService.get<string>('DB_PASSWORD'),
          database: this.configService.get<string>('DB_NAME'),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
