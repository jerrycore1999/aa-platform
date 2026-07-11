import { Module } from '@nestjs/common';
import { DockerfileService } from './dockerfile.service';

@Module({
  providers: [DockerfileService],
  exports: [DockerfileService],
})
export class DockerfileModule {}