import { Injectable, Logger } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { RepositoryInfo } from '../repository/interfaces/repository.interface';
import { DockerService } from './docker.service';
import { PreviewService } from './preview.service';
import { PortManagerService } from './port-manager.service';
import { DeploymentService } from '../deployment/deployment.service';
import { DeploymentLogService } from '../deployment-log/deployment-log.service';
import { DeploymentStatus, LogLevel } from '@prisma/client';
import { DetectorService } from '../detector/detector.service';
import { AnalyzerService } from '../analyzer/analyzer.service';
import { DockerfileService } from '../dockerfile/dockerfile.service';
import { BuildService } from '../build/build.service';

@Injectable()
export class DeployService {
  private readonly logger = new Logger(DeployService.name);

  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly dockerService: DockerService,
    private readonly previewService: PreviewService,
    private readonly portManagerService: PortManagerService,
    private readonly deploymentService: DeploymentService,
    private readonly deploymentLogService: DeploymentLogService,
    private readonly detectorService: DetectorService,
    private readonly analyzerService: AnalyzerService,
    private readonly dockerfileService: DockerfileService,
    private readonly buildService: BuildService,
  ) {}

  async deployPR(info: RepositoryInfo) {
    this.logger.log('Starting deployment...');

    const deployment = await this.deploymentService.create({
      prNumber: info.prNumber,
      owner: info.owner,
      repository: info.repo,
      branch: info.branch,
      imageName: '',
      containerId: '',
      port: 0,
      previewUrl: '',
      workspace: '',
    });

    await this.deploymentLogService.createLog(
      deployment.id,
      LogLevel.INFO,
      'Deployment queued',
    );

    try {
      // Clone Repository
      await this.deploymentService.updateStatus(
        deployment.id,
        DeploymentStatus.CLONING,
      );

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Cloning repository...',
      );

      const workspace = await this.repositoryService.prepareRepository(info);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Repository cloned successfully',
      );

      // Detect project
      const detection = await this.detectorService.detect(workspace);

      this.logger.log(`Detected project type: ${detection.type}`);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Detected project type: ${detection.type}`,
      );

      // Analyze project
      const analysis = await this.analyzerService.analyze(workspace);

      this.logger.log(`Detected frameworks: ${analysis.frameworks.join(', ')}`);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Detected frameworks: ${analysis.frameworks.join(', ')}`,
      );

      // Generate Dockerfile
      await this.dockerfileService.generate(workspace, analysis);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Dockerfile generated',
      );

      // Install Dependencies
      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Installing project dependencies...',
      );

      await this.buildService.installDependencies(workspace, analysis);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Dependencies installed successfully',
      );

      // Build Project
      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Building project...',
      );

      await this.buildService.buildProject(workspace, analysis);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Project build completed',
      );

      // Build Docker Image
      await this.deploymentService.updateStatus(
        deployment.id,
        DeploymentStatus.BUILDING,
      );

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Building Docker image...',
      );

      const imageName = await this.dockerService.buildImage(
        workspace,
        info.repo,
      );

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Docker image ${imageName} built`,
      );

      // Start Container
      await this.deploymentService.updateStatus(
        deployment.id,
        DeploymentStatus.STARTING,
      );

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Starting Docker container...',
      );

      const port = await this.portManagerService.getAvailablePort();

      const containerId = await this.dockerService.runContainer(
        imageName,
        port,
      );

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Container started: ${containerId}`,
      );

      // Preview URL
      const previewUrl = this.previewService.generateUrl(port);

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        `Preview available at ${previewUrl}`,
      );

      // Save deployment
      await this.deploymentService.updateDeployment(deployment.id, {
        workspace,
        imageName,
        containerId,
        port,
        previewUrl,
      });

      await this.deploymentService.updateStatus(
        deployment.id,
        DeploymentStatus.RUNNING,
      );

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.INFO,
        'Deployment completed successfully',
      );

      return {
        success: true,
        deploymentId: deployment.id,
        workspace,
        imageName,
        containerId,
        port,
        previewUrl,
      };
    } catch (error: unknown) {
      await this.deploymentService.updateStatus(
        deployment.id,
        DeploymentStatus.FAILED,
      );

      await this.deploymentLogService.createLog(
        deployment.id,
        LogLevel.ERROR,
        error instanceof Error ? error.message : String(error),
      );

      this.logger.error(
        'Deployment failed',
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
