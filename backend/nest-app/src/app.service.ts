import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    return 'server is riunning';
  }

  getHello(): string {
    return 'Server is running!';
  }
}
