export interface ProjectAnalysis {
  frameworks: string[];

  language: string;

  packageManager: string;

  installCommand: string;

  buildCommand: string;

  startCommand: string;

  outputDirectory: string;

  port: number;
}