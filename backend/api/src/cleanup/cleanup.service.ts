import { Injectable, Logger } from '@nestjs/common';

import { DeploymentService } from '../deployment/deployment.service';
import { DeploymentLogService } from '../deployment-log/deployment-log.service';

import { DockerService } from '../deploy/docker.service';
import { RepositoryService } from '../repository/repository.service';

import { DeploymentStatus, LogLevel } from '@prisma/client';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    private readonly deploymentService: DeploymentService,
    private readonly deploymentLogService: DeploymentLogService,
    private readonly dockerService: DockerService,
    private readonly repositoryService: RepositoryService,
  ) {}

  async cleanupByPrNumber(prNumber: number) {
    const deployment = await this.deploymentService.findByPrNumber(prNumber);

    if (!deployment) {
      this.logger.warn(`No deployment found for PR #${prNumber}`);

      return;
    }

    try {
      this.logger.log(`Starting cleanup for PR #${prNumber}`);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Cleanup started',
      );

      // Stop container
      this.logger.log(`Stopping container ${deployment.containerId}`);

      await this.dockerService.stopContainer(deployment.containerId);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Container stopped: ${deployment.containerId}`,
      );

      // Remove container
      this.logger.log(`Removing container ${deployment.containerId}`);

      await this.dockerService.removeContainer(deployment.containerId);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Container removed: ${deployment.containerId}`,
      );

      // Remove image
      this.logger.log(`Removing image ${deployment.imageName}`);

      await this.dockerService.removeImage(deployment.imageName);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Image removed: ${deployment.imageName}`,
      );

      // Delete workspace
      this.logger.log(`Removing workspace ${deployment.workspace}`);

      this.repositoryService.deleteWorkspace(deployment.workspace);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Workspace removed: ${deployment.workspace}`,
      );

      // Update deployment status
      await this.deploymentService.updateStatus(
        deployment.id,
        DeploymentStatus.STOPPED,
      );

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Cleanup completed successfully',
      );

      this.logger.log(`Cleanup completed for PR #${prNumber}`);

      return {
        success: true,
      };
    } catch (error: unknown) {
      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.ERROR,
        error instanceof Error ? error.message : String(error),
      );

      this.logger.error(
        'Cleanup failed',
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
