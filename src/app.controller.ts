import type { HealthRequest, HealthResponse } from '@contracts/proto';
import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as os from 'os';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): HealthResponse {
    return this.buildHealth('http');
  }

  @GrpcMethod('AppService', 'GetHealth')
  grpcGetHealth(request: HealthRequest): HealthResponse {
    return this.buildHealth(request.service || 'grpc');
  }

  private buildHealth(service: string): HealthResponse {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      service,
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
