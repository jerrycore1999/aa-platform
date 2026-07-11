import { Module } from '@nestjs/common';
import { DetectorService } from './detector.service';
import { DetectorController } from './detector.controller';

@Module({
  controllers: [DetectorController],
  providers: [DetectorService],
  exports: [DetectorService],
})
export class DetectorModule {}

