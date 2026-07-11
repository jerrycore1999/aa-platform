import { Test, TestingModule } from '@nestjs/testing';
import { DeployService } from './deploy.service';
import { RepositoryService } from '../repository/repository.service';
import { DockerService } from './docker.service';
import { PreviewService } from './preview.service';
import { PortManagerService } from './port-manager.service';
import { DeploymentService } from '../deployment/deployment.service';
import { DeploymentLogService } from '../deployment-log/deployment-log.service';

describe('DeployService', () => {
  let service: DeployService;
  const providerMocks = [
    {
      provide: RepositoryService,
      useValue: {
        prepareRepository: jest.fn(),
      },
    },
    {
      provide: DockerService,
      useValue: {
        buildImage: jest.fn(),
        runContainer: jest.fn(),
      },
    },
    {
      provide: PreviewService,
      useValue: {
        generateUrl: jest.fn(),
      },
    },
    {
      provide: PortManagerService,
      useValue: {
        getAvailablePort: jest.fn(),
      },
    },
    {
      provide: DeploymentService,
      useValue: {
        create: jest.fn(),
        updateDeployment: jest.fn(),
        updateStatus: jest.fn(),
      },
    },
    {
      provide: DeploymentLogService,
      useValue: {
        createLog: jest.fn(),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeployService, ...providerMocks],
    }).compile();

    service = module.get<DeployService>(DeployService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
