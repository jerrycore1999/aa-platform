import { Injectable, Logger } from '@nestjs/common';
import simpleGit, { SimpleGit } from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';

export interface RepositoryInfo {
  prNumber: number;
  owner: string;
  repo: string;
  cloneUrl: string;
  branch: string;
}

@Injectable()
export class RepositoryService {
  private readonly logger = new Logger(RepositoryService.name);

  private readonly workspace = path.join(process.cwd(), 'workspace');

  private readonly git: SimpleGit = simpleGit();

  async prepareRepository(info: RepositoryInfo) {
    if (!fs.existsSync(this.workspace)) {
      fs.mkdirSync(this.workspace, { recursive: true });
    }

    const repoPath = path.join(
      this.workspace,
      `${info.owner}-${info.repo}-pr-${info.prNumber}`,
    );

    this.logger.log(`Workspace: ${repoPath}`);

    if (!fs.existsSync(repoPath)) {
      await this.cloneRepository(info.cloneUrl, repoPath);
    } else {
      await this.fetchRepository(repoPath);
    }

    await this.checkoutBranch(repoPath, info.branch);

    return repoPath;
  }

  private async cloneRepository(cloneUrl: string, repoPath: string) {
    this.logger.log(`Cloning ${cloneUrl}`);

    try {
      await this.git.clone(cloneUrl, repoPath);

      this.logger.log('Repository cloned successfully');
    } catch (error) {
      this.logger.error(`Clone failed: ${cloneUrl}`);

      throw error;
    }
  }

  private async fetchRepository(repoPath: string) {
    this.logger.log('Fetching latest changes');

    try {
      await simpleGit(repoPath).fetch();
    } catch (error) {
      this.logger.error('Failed to fetch repository changes');

      throw error;
    }

    this.logger.log('Repository updated');
  }

  private async checkoutBranch(repoPath: string, branch: string) {
    const git = simpleGit(repoPath);

    this.logger.log(`Checking out branch: ${branch}`);

    await git.fetch();

    try {
      await git.checkout(branch);
    } catch {
      await git.checkout(['-B', branch, `origin/${branch}`]);
    }

    this.logger.log(`Checked out branch: ${branch}`);
  }

  deleteWorkspace(workspace: string) {
    if (!fs.existsSync(workspace)) {
      return;
    }

    fs.rmSync(workspace, {
      recursive: true,
      force: true,
    });

    this.logger.log(`Workspace removed: ${workspace}`);
  }
}
