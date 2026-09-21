import { status } from '@grpc/grpc-js';
import {
    ConflictException,
    Inject,
    Injectable,
    OnModuleInit,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { ClientGrpc } from '@nestjs/microservices';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { USER_GRPC_CLIENT } from '../../app.grpc';
import {
    USER_SERVICE_NAME,
    type AuthResponse,
    type UserServiceClient,
} from '../../contracts';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService implements OnModuleInit {
    private userService!: UserServiceClient;

    constructor(
        @Inject(USER_GRPC_CLIENT) private readonly client: ClientGrpc,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    async onModuleInit() {
        this.userService =
            this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
        await this.userModel.createCollection();
    }

    async register(dto: RegisterDto): Promise<AuthResponse> {
        const email = dto.email.trim().toLowerCase();
        const existing = await this.userModel.findOne({ email }).exec();
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        try {
            const user = await firstValueFrom(
                this.userService.createUser({
                    email,
                    password: dto.password,
                }),
            );
            await this.userModel.create({
                email,
                passwordHash: this.hash(dto.password),
            });
            return this.toAuthResponse(user);
        } catch (error) {
            this.rethrowUser(error);
        }
    }

    async login(dto: LoginDto): Promise<AuthResponse> {
        const email = dto.email.trim().toLowerCase();
        const stored = await this.userModel.findOne({ email }).exec();
        if (stored && stored.passwordHash === this.hash(dto.password)) {
            return this.toAuthResponse({
                id: stored.id,
                email: stored.email,
            });
        }

        try {
            const result = await firstValueFrom(
                this.userService.validateCredentials({
                    email,
                    password: dto.password,
                }),
            );
            if (!result.valid || !result.user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            return this.toAuthResponse(result.user);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.rethrowUser(error);
        }
    }

    private hash(password: string): string {
        return createHash('sha256').update(password).digest('hex');
    }

    private toAuthResponse(user: { id: string; email: string }): AuthResponse {
        const accessToken = Buffer.from(
            JSON.stringify({ sub: user.id, email: user.email }),
        ).toString('base64url');

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }

    private rethrowUser(error: unknown): never {
        const code = (error as { code?: number }).code;
        if (code === status.ALREADY_EXISTS) {
            throw new ConflictException('Email already registered');
        }
        throw new ServiceUnavailableException('user-service gRPC is unreachable');
    }
}
