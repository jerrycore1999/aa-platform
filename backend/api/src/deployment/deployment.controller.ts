import { Controller, Get, Param, Delete } from '@nestjs/common';

import { DeploymentService } from './deployment.service';

@Controller('deployments')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Get()
  findAll() {
    return this.deploymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deploymentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deploymentService.delete(id);
  }
}
