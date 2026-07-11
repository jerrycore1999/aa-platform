import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DeployService } from './deploy.service';
import { DeployPrDto } from './dto/deploy-pr.dto';


@ApiTags('Deploy')
@Controller('deploy')
export class DeployController {

  constructor(
    private readonly deployService: DeployService,
  ) {}


  @Post('pr')
  @ApiOperation({
    summary: 'Deploy a pull request preview',
  })
  async deployPR(
    @Body() dto: DeployPrDto,
  ) {

    return this.deployService.deployPR(dto);

  }
}