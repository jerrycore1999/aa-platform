export enum ProjectType {
  DOCKER = 'docker',
  NODE = 'node',
  NEST = 'nest',
  EXPRESS = 'express',
  NEXT = 'next',
  REACT = 'react',
  VITE = 'vite',
  ANGULAR = 'angular',
  VUE = 'vue',
  PYTHON = 'python',
  JAVA = 'java',
  GO = 'go',
  RUST = 'rust',
  PHP = 'php',
  STATIC = 'static',
  UNKNOWN = 'unknown',
}

export interface DetectionResult {
  type: ProjectType;
  framework?: string;
  hasDockerfile: boolean;
}