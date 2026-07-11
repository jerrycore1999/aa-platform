import { Module } from '@nestjs/common';

import { RepositoryModule } from '../repository/repository.module';
import { DeploymentModule } from '../deployment/deployment.module';
import { DeploymentLogModule } from '../deployment-log/deployment-log.module';

import { DetectorModule } from '../detector/detector.module';
import { AnalyzerModule } from '../analyzer/analyzer.module';
import { DockerfileModule } from '../dockerfile/dockerfile.module';

import { BuildModule } from '../build/build.module';

import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';

import { DockerService } from './docker.service';
import { PreviewService } from './preview.service';
import { PortManagerService } from './port-manager.service';

@Module({
  imports: [
    RepositoryModule,
    DeploymentModule,
    DeploymentLogModule,
    DetectorModule,
    AnalyzerModule,
    DockerfileModule,
    BuildModule,      // <-- ADD THIS
  ],
  controllers: [DeployController],
  providers: [
    DeployService,
    DockerService,
    PreviewService,
    PortManagerService,
  ],
  exports: [
    DeployService,
    DockerService,
    PreviewService,
    PortManagerService,
  ],
})
export class DeployModule {}