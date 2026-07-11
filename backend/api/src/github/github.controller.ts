import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
} from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  private readonly logger = new Logger(GithubController.name);

  constructor(private readonly githubService: GithubService) {}

  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Headers('x-github-event') event: string,
    @Body() payload: any,
  ) {
    this.logger.log(`GitHub Event: ${event}`);

    return this.githubService.handleWebhook(event, payload);
  }
}
