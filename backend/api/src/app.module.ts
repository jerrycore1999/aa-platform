import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VerificationModule } from './verification/verification.module';
import { DeployModule } from './deploy/deploy.module';
import { GithubModule } from './github/github.module';
import { RepositoryModule } from './repository/repository.module';
import { DeploymentModule } from './deployment/deployment.module';
import { AppController } from './app.controller';
import { CleanupModule } from './cleanup/cleanup.module';
import { DetectorModule } from './detector/detector.module';
import { AnalyzerModule } from './analyzer/analyzer.module';
import { DockerfileModule } from './dockerfile/dockerfile.module';
import { BuildModule } from './build/build.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    VerificationModule,
    DeployModule,
    GithubModule,
    RepositoryModule,
    DeploymentModule,
    CleanupModule,
    DetectorModule,
    AnalyzerModule,
    DockerfileModule,
    BuildModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
