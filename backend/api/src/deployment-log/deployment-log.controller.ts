import { Controller, Get, Param } from '@nestjs/common';
import { DeploymentLogService } from './deployment-log.service';

@Controller('deployment-logs')
export class DeploymentLogController {
  constructor(private readonly deploymentLogService: DeploymentLogService) {}

  @Get(':deploymentId')
  async getLogs(@Param('deploymentId') deploymentId: string) {
    return this.deploymentLogService.findByDeployment(deploymentId);
  }
}
