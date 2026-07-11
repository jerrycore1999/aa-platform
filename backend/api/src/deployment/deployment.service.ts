import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DeploymentStatus } from '@prisma/client';

@Injectable()
export class DeploymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    prNumber: number;
    owner: string;
    repository: string;
    branch: string;
    workspace: string;
    imageName: string;
    containerId: string;
    port: number;
    previewUrl: string;
  }) {
    return this.prisma.deployment.create({
      data: {
        ...data,
        status: DeploymentStatus.QUEUED,
      },
    });
  }

  async findAll() {
    return this.prisma.deployment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.deployment.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.deployment.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: DeploymentStatus) {
    return this.prisma.deployment.update({
      where: { id },
      data: { status },
    });
  }

  async updateDeployment(
    id: string,
    data: {
      workspace: string;
      imageName: string;
      containerId: string;
      port: number;
      previewUrl: string;
    },
  ) {
    return this.prisma.deployment.update({
      where: { id },
      data,
    });
  }
  async findByPrNumber(prNumber: number) {
    return this.prisma.deployment.findFirst({
      where: {
        prNumber,
        status: DeploymentStatus.RUNNING,
      },
    });
  }
}
