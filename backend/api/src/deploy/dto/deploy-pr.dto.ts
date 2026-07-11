import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class DeployPrDto {

  @ApiProperty({
    example: 12,
    description: 'Pull request number',
  })
  @IsNumber()
  prNumber: number;


  @ApiProperty({
    example: 'jerrycore1999',
    description: 'GitHub repository owner',
  })
  @IsString()
  owner: string;


  @ApiProperty({
    example: 'demo-app',
    description: 'Repository name',
  })
  @IsString()
  repo: string;


  @ApiProperty({
    example: 'https://github.com/user/demo-app.git',
    description: 'Repository clone URL',
  })
  @IsUrl()
  cloneUrl: string;


  @ApiProperty({
    example: 'main',
    description: 'Branch to deploy',
  })
  @IsString()
  branch: string;
}