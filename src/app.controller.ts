import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string; pid: number } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString().split('T')[1],
      pid: process.pid,
    };
  }

  @Get('bench/cpu')
  getCpuBench(): { status: string; pid: number } {
    const end = Date.now() + 5;
    while (Date.now() < end) {
      // Occupy the event loop so extra workers can show throughput gains.
    }
    return { status: 'OK', pid: process.pid };
  }
}
