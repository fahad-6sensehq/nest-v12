import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.getOrThrow<string>('MONGODB_URI'),
                dbName: configService.get<string>('MONGODB_DB_NAME') ?? 'grpc',
                autoCreate: true,
                autoIndex: true,
                maxPoolSize: 10,
                minPoolSize: 1,
                connectionFactory: (connection) => {
                    console.log(
                        `MongoDB connected to database "${connection.name}"`,
                    );
                    connection.on('error', (error) => {
                        console.error('MongoDB connection error', error);
                    });
                    return connection;
                },
            }),
        }),
    ],
})
export class MongoModule {}
