import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { ProjectAnalysis } from '../analyzer/interfaces/project-analysis.interface';

import { nodeDockerfile } from './templates/node';
import { nestDockerfile } from './templates/nest';
import { nextDockerfile } from './templates/next';
import { reactDockerfile } from './templates/react';
import { expressDockerfile } from './templates/express';

@Injectable()
export class DockerfileService {
  private readonly logger = new Logger(DockerfileService.name);

  async generate(
    workspace: string,
    analysis: ProjectAnalysis,
  ): Promise<void> {
    const dockerfilePath = path.join(workspace, 'Dockerfile');

    if (fs.existsSync(dockerfilePath)) {
      this.logger.log('Dockerfile already exists');

      return;
    }

    let dockerfile = nodeDockerfile;

    if (analysis.frameworks.includes('NestJS')) {
      dockerfile = nestDockerfile;
    } else if (analysis.frameworks.includes('Next.js')) {
      dockerfile = nextDockerfile;
    } else if (analysis.frameworks.includes('React')) {
      dockerfile = reactDockerfile;
    } else if (analysis.frameworks.includes('Express')) {
      dockerfile = expressDockerfile;
    }

    fs.writeFileSync(dockerfilePath, dockerfile);

    this.logger.log(
      `Dockerfile generated for ${analysis.frameworks.join(', ')}`,
    );
  }
}