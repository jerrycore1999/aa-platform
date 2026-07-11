import { Injectable, Logger } from '@nestjs/common';
import { DeployService } from '../deploy/deploy.service';
import { CleanupService } from '../cleanup/cleanup.service';

interface PullRequestWebhookPayload {
  action: string;
  pull_request: {
    number: number;
    head: {
      ref: string;
    };
  };
  repository: {
    full_name: string;
    name: string;
    clone_url: string;
    owner: {
      login: string;
    };
  };
}

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private readonly deployService: DeployService,
    private readonly cleanupService: CleanupService,
  ) {}

  async handleWebhook(event: string, payload: unknown) {
    this.logger.log(`Received GitHub event: ${event}`);

    switch (event) {
      case 'pull_request':
        return this.handlePullRequest(payload as PullRequestWebhookPayload);

      case 'ping':
        this.logger.log('GitHub webhook verified successfully');
        return { message: 'pong' };

      default:
        this.logger.warn(`Unhandled GitHub event: ${event}`);
        return { message: 'ignored' };
    }
  }

  private async handlePullRequest(payload: PullRequestWebhookPayload) {
    const { action, pull_request, repository } = payload;

    this.logger.log(
      `PR #${pull_request.number} ${action} (${repository.full_name})`,
    );

    const owner = repository.owner.login;
    const repo = repository.name;
    const cloneUrl = repository.clone_url;
    const branch = pull_request.head.ref;

    switch (action) {
      case 'opened':
      case 'reopened':
      case 'synchronize':
        this.logger.log(`Deployment queued for PR #${pull_request.number}`);

        await this.deployService.deployPR({
          prNumber: pull_request.number,
          owner,
          repo,
          cloneUrl,
          branch,
        });

        break;

      case 'closed':
        this.logger.log(`Cleanup queued for PR #${pull_request.number}`);

        await this.cleanupService.cleanupByPrNumber(pull_request.number);

        break;

      default:
        this.logger.warn(`Unhandled PR action: ${action}`);

        return {
          success: false,
          message: 'Ignored event',
        };
    }

    return {
      success: true,
      action,
      prNumber: pull_request.number,
      branch,
      repository: repository.full_name,
    };
  }
}
