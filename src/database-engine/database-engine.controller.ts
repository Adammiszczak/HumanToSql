import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('database-engine')
export class DatabaseEngineController {
  private readonly logger = new Logger(DatabaseEngineController.name);

  constructor(private configService: ConfigService) {}
}
