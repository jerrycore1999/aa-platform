import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LogLevel } from '@prisma/client';

@Injectable()
export class DeploymentLogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(deploymentId: string, level: LogLevel, message: string) {
    return this.prisma.deploymentLog.create({
      data: {
        deploymentId,
        level,
        message,
      },
    });
  }

  async findByDeployment(deploymentId: string) {
    return this.prisma.deploymentLog.findMany({
      where: {
        deploymentId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
