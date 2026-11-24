import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { handleError } from '../common/helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Process } from './entities';
import { Repository } from 'typeorm';
import { ProcessState } from './enums';

@Injectable()
export class ProcessService {

  constructor(
    @InjectRepository(Process)
    private readonly processRepository: Repository<Process>
  ){}

  async create(createProcessDto: CreateProcessDto) {
    try {

      const newProcess = this.processRepository.create({
        ...createProcessDto,
        state: ProcessState.NEW,
        remainingTime: createProcessDto.burstTime,
        arrivalTime: new Date(),
      });

      await this.processRepository.save(newProcess);

      return newProcess;
      
    } catch (error) {
      handleError(error);
    }
  }

  findAll() {
    try {

      return this.processRepository.find();

    } catch (error) {
      handleError(error);
    }
  }

  findOne(pid: number) {
    try {

      const process = this.processRepository.findOne({where: {pid}});

      if(!process) throw new NotFoundException(`process with pid: ${pid} not found`);

      return process;
      
    } catch (error) {
      handleError(error);
    }
  }

  async update(pid: number, updateProcessDto: UpdateProcessDto) {
    try {

      await this.findOne(pid);
     
      await this.processRepository.update(pid, updateProcessDto);

      return this.findOne(pid);

    } catch (error) {
      handleError(error);
    }
  }

  async remove(pid: number) {

    try {

      const process = await this.findOne(pid);
     
      await this.processRepository.delete(pid);

      return process;

    } catch (error) {
      handleError(error);
    }


  }
}
