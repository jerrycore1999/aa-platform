import { Test, TestingModule } from '@nestjs/testing';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';

describe('DeployController', () => {
  let controller: DeployController;
  const deployService = {
    deployPR: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeployController],
      providers: [
        {
          provide: DeployService,
          useValue: deployService,
        },
      ],
    }).compile();

    controller = module.get<DeployController>(DeployController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
