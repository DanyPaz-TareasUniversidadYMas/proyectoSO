import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Process } from './entities';

@Module({
  controllers: [ProcessController],
  providers: [ProcessService],
  imports: [TypeOrmModule.forFeature([Process])],
})
export class ProcessModule {}
