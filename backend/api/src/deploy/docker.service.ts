import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);

  hasDockerfile(workspace: string): boolean {
    const dockerfile = path.join(workspace, 'Dockerfile');
    return fs.existsSync(dockerfile);
  }

  async buildImage(workspace: string, imageName: string): Promise<string> {
    if (!this.hasDockerfile(workspace)) {
      throw new Error(`Dockerfile not found in ${workspace}`);
    }

    this.logger.log(`Building Docker image: ${imageName}`);

    const command = `docker build -t ${imageName} "${path.resolve(workspace)}"`;

    this.logger.log(command);

    const { stdout, stderr } = await execAsync(command);

    if (stdout) {
      this.logger.log(stdout);
    }

    if (stderr) {
      this.logger.warn(stderr);
    }

    this.logger.log('Docker image built successfully');

    return imageName;
  }

  async runContainer(imageName: string, port: number): Promise<string> {
    this.logger.log(`Starting container: ${imageName}`);

    const command = `docker run -d --name ${imageName} -p ${port}:3000 ${imageName}`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      this.logger.warn(stderr);
    }

    const containerId = stdout.trim();

    this.logger.log(`Container started: ${containerId}`);

    return containerId;
  }
  async stopContainer(containerId: string) {
    this.logger.log(`Stopping ${containerId}`);

    await execAsync(`docker stop ${containerId}`);
  }

  async removeContainer(containerId: string) {
    this.logger.log(`Removing ${containerId}`);

    await execAsync(`docker rm ${containerId}`);
  }

  async removeImage(imageName: string) {
    this.logger.log(`Removing image ${imageName}`);

    await execAsync(`docker rmi ${imageName}`);
  }
}
