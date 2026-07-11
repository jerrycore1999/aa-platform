import { Module } from '@nestjs/common';

import { DeploymentLogService } from './deployment-log.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],

  providers: [DeploymentLogService],

  exports: [DeploymentLogService],
})
export class DeploymentLogModule {}
