import { Injectable } from '@nestjs/common';

@Injectable()
export class PreviewService {
  generateUrl(port: number): string {
    return `http://localhost:${port}`;
  }
}
