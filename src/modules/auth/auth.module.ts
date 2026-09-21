import { USER_PACKAGE, USER_PROTO_PATH } from '../../contracts';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_GRPC_CLIENT, USER_GRPC_URL } from '../../app.grpc';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ClientsModule.register([
            {
                name: USER_GRPC_CLIENT,
                transport: Transport.GRPC,
                options: {
                    package: USER_PACKAGE,
                    protoPath: USER_PROTO_PATH,
                    url: USER_GRPC_URL,
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
