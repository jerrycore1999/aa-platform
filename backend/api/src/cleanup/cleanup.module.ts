import { Module } from '@nestjs/common';

import { CleanupService } from './cleanup.service';

import { DeploymentModule } from '../deployment/deployment.module';
import { DeploymentLogModule } from '../deployment-log/deployment-log.module';
import { DeployModule } from '../deploy/deploy.module';
import { RepositoryModule } from '../repository/repository.module';

import { DockerService } from '../deploy/docker.service';

@Module({
  imports: [
    DeploymentModule,
    DeploymentLogModule,
    DeployModule,
    RepositoryModule,
  ],
  providers: [CleanupService, DockerService],
  exports: [CleanupService],
})
export class CleanupModule {}
