import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import {
  DetectionResult,
  ProjectType,
} from './interfaces/project-type.interface';

@Injectable()
export class DetectorService {

  async detect(workspace: string): Promise<DetectionResult> {

    const dockerfile = path.join(workspace, 'Dockerfile');

    if (fs.existsSync(dockerfile)) {
      return {
        type: ProjectType.DOCKER,
        hasDockerfile: true,
      };
    }

    const packageJson = path.join(workspace, 'package.json');

    if (fs.existsSync(packageJson)) {
      return {
        type: ProjectType.NODE,
        hasDockerfile: false,
      };
    }

    if (fs.existsSync(path.join(workspace, 'requirements.txt'))) {
      return {
        type: ProjectType.PYTHON,
        hasDockerfile: false,
      };
    }

    if (fs.existsSync(path.join(workspace, 'go.mod'))) {
      return {
        type: ProjectType.GO,
        hasDockerfile: false,
      };
    }

    if (fs.existsSync(path.join(workspace, 'pom.xml'))) {
      return {
        type: ProjectType.JAVA,
        hasDockerfile: false,
      };
    }

    return {
      type: ProjectType.UNKNOWN,
      hasDockerfile: false,
    };
  }
}