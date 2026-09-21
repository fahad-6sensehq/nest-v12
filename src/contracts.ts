import { createRequire } from 'module';
import { dirname, join } from 'path';
import type { Observable } from 'rxjs';

const protoRoot = dirname(createRequire(__filename).resolve('@contracts/proto'));

export const USER_PACKAGE = 'user.v1' as const;
export const USER_SERVICE_NAME = 'UserService';
export const USER_PROTO_PATH = join(protoRoot, 'proto/user/v1/user.proto');

export const AUTH_PACKAGE = 'auth.v1' as const;
export const AUTH_SERVICE_NAME = 'AuthService';
export const AUTH_PROTO_PATH = join(protoRoot, 'proto/auth/v1/auth.proto');

export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type UserServiceClient = {
  createUser(request: { email: string; password: string }): Observable<User>;
  getUserByEmail(request: { email: string }): Observable<User>;
  validateCredentials(request: {
    email: string;
    password: string;
  }): Observable<{ valid: boolean; user?: User }>;
};

export type AuthResponse = {
  accessToken: string;
  user: { id: string; email: string };
};
