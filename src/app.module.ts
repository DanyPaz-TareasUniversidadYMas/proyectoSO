import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessModule } from './process/process.module';
import { SystemModule } from './system/system.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { FileSystemModule } from './file-system/file-system.module';
import { AlertsModule } from './alerts/alerts.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JoiValidationSchema } from './common/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SendEmailModule } from './send-email/send-email.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ProcessModule,
    SystemModule,
    SchedulerModule,
    FileSystemModule,
    AlertsModule,
    UsersModule,
    AuthModule,
    SendEmailModule,
    VerificationCodeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
