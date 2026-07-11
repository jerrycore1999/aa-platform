import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

import { ProjectAnalysis } from '../analyzer/interfaces/project-analysis.interface';

const execAsync = promisify(exec);

@Injectable()
export class BuildService {
  private readonly logger = new Logger(BuildService.name);

  async installDependencies(
    workspace: string,
    analysis: ProjectAnalysis,
  ): Promise<void> {
    this.logger.log(`Running: ${analysis.installCommand}`);

    await execAsync(analysis.installCommand, {
      cwd: workspace,
    });

    this.logger.log('Dependencies installed');
  }

  async buildProject(
    workspace: string,
    analysis: ProjectAnalysis,
  ): Promise<void> {
    this.logger.log(`Running: ${analysis.buildCommand}`);

    await execAsync(analysis.buildCommand, {
      cwd: workspace,
    });

    this.logger.log('Project built successfully');
  }
}