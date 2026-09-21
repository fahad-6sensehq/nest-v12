import { Controller, Get } from '@nestjs/common';
import * as os from 'os';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): { status: string; timestamp: string; pid: number } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString().split('T')[1],
      pid: process.pid,
    };
  }

  @Get('activity')
  getActivity(): { status: string; pid: number; memory: NodeJS.MemoryUsage; cpu: number; secret: string } {
    const pid = process.pid;
    const memory = process.memoryUsage();
    const cpu = os.cpus().length;
    const secret = process.env.SECRET_KEY as string;
    return { status: 'OK', pid, memory, cpu, secret };
  }
}
