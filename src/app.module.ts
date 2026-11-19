import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessModule } from './process/process.module';
import { SystemModule } from './system/system.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { FileSystemModule } from './file-system/file-system.module';
import { AlertsModule } from './alerts/alerts.module';

import {ConfigModule} from '@nestjs/config';
import { JoiValidationSchema } from './common/config';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      		
			validationSchema: JoiValidationSchema


		}),
    ProcessModule, SystemModule, SchedulerModule, FileSystemModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
