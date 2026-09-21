import { APP_PACKAGE, APP_PROTO_PATH } from '@contracts/proto';
import { Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE, AUTH_PROTO_PATH } from './contracts';

export const HTTP_PORT = 5000;
export const GRPC_URL = '0.0.0.0:5001';
export const USER_GRPC_CLIENT = 'USER_GRPC_CLIENT';
export const USER_GRPC_URL = process.env.USER_GRPC_URL ?? 'localhost:4001';

export const grpcServerOptions = {
  transport: Transport.GRPC as const,
  options: {
    package: [APP_PACKAGE, AUTH_PACKAGE],
    protoPath: [APP_PROTO_PATH, AUTH_PROTO_PATH],
    url: GRPC_URL,
  },
};
