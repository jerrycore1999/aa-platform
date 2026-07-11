import { Injectable, Logger } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class PortManagerService {
  private readonly logger = new Logger(PortManagerService.name);

  private readonly startPort = 3001;

  async getAvailablePort(): Promise<number> {
    let port = this.startPort;

    while (!(await this.isPortFree(port))) {
      port++;
    }

    this.logger.log(`Allocated port ${port}`);

    return port;
  }

  private isPortFree(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();

      server.once('error', () => {
        resolve(false);
      });

      server.once('listening', () => {
        server.close(() => resolve(true));
      });

      server.listen(port);
    });
  }
}
