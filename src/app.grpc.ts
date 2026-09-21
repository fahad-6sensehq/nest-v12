import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { firstValueFrom, Observable } from 'rxjs';

export const HTTP_PORT = 5000;
export const GRPC_URL = '0.0.0.0:5001';
export const GRPC_CLIENT_URL = 'localhost:5001';

export const grpcClientOptions = (url: string) => ({
  transport: Transport.GRPC as const,
  options: {
    package: 'app',
    protoPath: join(__dirname, 'app.proto'),
    url,
  },
});

export interface HealthRequest {
  service: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  pid: number;
  service: string;
}

export interface AppGrpcService {
  getHealth(request: HealthRequest): Observable<HealthResponse>;
}

async function callGetHealth() {
  const client = ClientProxyFactory.create(grpcClientOptions(GRPC_CLIENT_URL));
  const appService = client.getService<AppGrpcService>('AppService');
  const response = await firstValueFrom(
    appService.getHealth({ service: 'grpc-client' }),
  );

  console.log(response);
  client.close();
}

const isDirectRun = /app\.grpc\.(t|j)s$/.test(process.argv[1] ?? '');
if (isDirectRun) {
  callGetHealth().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
