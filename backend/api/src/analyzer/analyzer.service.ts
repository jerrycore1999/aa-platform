import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { ProjectAnalysis } from './interfaces/project-analysis.interface';

@Injectable()
export class AnalyzerService {
  async analyze(workspace: string): Promise<ProjectAnalysis> {
    const packageJson = path.join(workspace, 'package.json');

    if (!fs.existsSync(packageJson)) {
      throw new Error('package.json not found');
    }

    const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));

    const dependencies = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    const frameworks: string[] = [];

    // Detect package manager
    let packageManager = 'npm';

    if (fs.existsSync(path.join(workspace, 'package-lock.json'))) {
      packageManager = 'npm';
    }

    if (fs.existsSync(path.join(workspace, 'yarn.lock'))) {
      packageManager = 'yarn';
    }

    if (fs.existsSync(path.join(workspace, 'pnpm-lock.yaml'))) {
      packageManager = 'pnpm';
    }

    // Commands based on package manager
    let installCommand = 'npm install';
    let buildCommand = 'npm run build';
    let startCommand = 'npm run start';

    switch (packageManager) {
      case 'yarn':
        installCommand = 'yarn';
        buildCommand = 'yarn build';
        startCommand = 'yarn start';
        break;

      case 'pnpm':
        installCommand = 'pnpm install';
        buildCommand = 'pnpm build';
        startCommand = 'pnpm start';
        break;
    }

    // Framework detection
    if (dependencies['@nestjs/core']) {
      frameworks.push('NestJS');
    }

    if (dependencies['next']) {
      frameworks.push('Next.js');
    }

    if (dependencies['react']) {
      frameworks.push('React');
    }

    if (dependencies['express']) {
      frameworks.push('Express');
    }

    if (dependencies['vite']) {
      frameworks.push('Vite');
    }

    if (dependencies['fastify']) {
      frameworks.push('Fastify');
    }

    if (dependencies['koa']) {
      frameworks.push('Koa');
    }

    if (dependencies['hono']) {
      frameworks.push('Hono');
    }

    if (dependencies['vue']) {
      frameworks.push('Vue');
    }

    if (dependencies['angular']) {
      frameworks.push('Angular');
    }

    if (dependencies['svelte']) {
      frameworks.push('Svelte');
    }

    if (dependencies['nuxt']) {
      frameworks.push('Nuxt');
    }

    if (frameworks.length === 0) {
      frameworks.push('Node.js');
    }

    return {
      frameworks,
      language: 'Node.js',
      packageManager,
      installCommand,
      buildCommand,
      startCommand,
      outputDirectory: 'dist',
      port: 3000,
    };
  }
}
