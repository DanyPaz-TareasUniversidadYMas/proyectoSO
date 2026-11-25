import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleError } from '../common/helpers';
import { Alert } from './entities/alert.entity';

@Injectable()
export class AlertsService {

  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  findAll() {
    try {
      return this.alertRepository.find({ order: { createdAt: 'DESC' } });
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const alert = await this.alertRepository.findOne({ where: { id } });

      if (!alert) throw new NotFoundException(`alert with id: ${id} not found`);

      return alert;
    } catch (error) {
      handleError(error);
    }
  }

  async resolve(id: number) {
    try {
      const alert = await this.findOne(id);

      alert!.resolved = true;
      alert!.resolvedAt = new Date();

      return await this.alertRepository.save(alert!);
    } catch (error) {
      handleError(error);
    }
  }
}