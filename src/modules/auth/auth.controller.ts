import { status } from '@grpc/grpc-js';
import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @GrpcMethod('AuthService', 'Register')
    async grpcRegister(request: RegisterDto) {
        try {
            return await this.authService.register(request);
        } catch (error) {
            this.throwRpc(error);
        }
    }

    @GrpcMethod('AuthService', 'Login')
    async grpcLogin(request: LoginDto) {
        try {
            return await this.authService.login(request);
        } catch (error) {
            this.throwRpc(error);
        }
    }

    private throwRpc(error: unknown): never {
        if (error instanceof HttpException) {
            throw new RpcException({
                code: this.httpToGrpc(error.getStatus()),
                message: error.message,
            });
        }
        throw error;
    }

    private httpToGrpc(httpStatus: number): number {
        if (httpStatus === 409) {
            return status.ALREADY_EXISTS;
        }
        if (httpStatus === 401) {
            return status.UNAUTHENTICATED;
        }
        if (httpStatus === 503) {
            return status.UNAVAILABLE;
        }
        return status.UNKNOWN;
    }
}
