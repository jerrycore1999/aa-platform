import { Module } from '@nestjs/common';

import { GithubController } from './github.controller';
import { GithubService } from './github.service';

import { RepositoryModule } from '../repository/repository.module';
import { CleanupModule } from '../cleanup/cleanup.module';
import { DeployModule } from '../deploy/deploy.module';

@Module({
  imports: [RepositoryModule, CleanupModule, DeployModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
