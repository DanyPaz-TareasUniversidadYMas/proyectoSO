import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { handleError } from '../common/helpers';

import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

@Injectable()
export class SystemService {
  async create(createSystemDto: CreateSystemDto) {
    try {
      // Crear un proceso real en Linux
      const child = spawn(createSystemDto.name, [
        String(createSystemDto.duration),
      ]);

      // Esperar a que Linux inicie el proceso
      await new Promise<void>((resolve, reject) => {
        child.once('spawn', () => resolve());
        child.once('error', (error) => reject(error));
      });

      // Consultar información del proceso mediante ps
      const { stdout } = await execFileAsync('ps', [
        '-p',
        String(child.pid),
        '-o',
        'pid,ppid,comm,pcpu,pmem,stat,etime',
        '--no-headers',
      ]);

      // Convertir la salida en un objeto
      const [pid, ppid, name, cpu, memory, state, elapsedTime] = stdout
        .trim()
        .split(/\s+/);

      return {
        pid: Number(pid),
        parentPid: Number(ppid),
        name,
        cpuPercentage: Number(cpu),
        memoryPercentage: Number(memory),
        state,
        elapsedTime,
      };
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  }

  async findAll() {
    try {
      const { stdout } = await execFileAsync('ps', [
        '-eo',
        'pid,ppid,comm,ni,pcpu,pmem,rss,stat,etime',
        '--no-headers',
      ]);

      const processes = stdout
        .trim()
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
          const [
            pid,
            parentPid,
            name,
            priority,
            cpu,
            memory,
            rss,
            state,
            elapsedTime,
          ] = line.trim().split(/\s+/);

          return {
            pid: Number(pid),
            parentPid: Number(parentPid),
            name,
            priority: Number(priority),
            cpuPercentage: Number(cpu),
            memoryPercentage: Number(memory),
            memoryBytes: Number(rss) * 1024,
            state,
            elapsedTime,
          };
        });

      return processes;
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const { stdout } = await execFileAsync('ps', [
        '-p',
        String(id),
        '-o',
        'pid,ppid,comm,ni,pcpu,pmem,rss,stat,etime',
        '--no-headers',
      ]);

      if (!stdout.trim()) {
        throw new NotFoundException(`No se encontró el proceso con PID ${id}`);
      }

      const [
        pid,
        parentPid,
        name,
        priority,
        cpu,
        memory,
        rss,
        state,
        elapsedTime,
      ] = stdout.trim().split(/\s+/);

      return {
        pid: Number(pid),
        parentPid: Number(parentPid),
        name,
        priority: Number(priority),
        cpuPercentage: Number(cpu),
        memoryPercentage: Number(memory),
        memoryBytes: Number(rss) * 1024,
        state,
        elapsedTime,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleError(error);
    }
  }

  async update(id: number, updateSystemDto: UpdateSystemDto) {
    try {
      // Consultar el proceso
      await this.findOne(id);

      // Modificar la prioridad
      await execFileAsync('sudo', [
        '-n',
        '/usr/bin/renice',
        '--priority',
        String(updateSystemDto.priority),
        '--pid',
        String(id),
      ]);

      // Consultar el proceso actualizado
      return await this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      // Solicitar la finalización del proceso
      await execFileAsync('kill', ['-TERM', String(id)]);

      return {
        message: `Se solicitó la finalización del proceso ${id}`,
        pid: id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleError(error);
    }
  }
}
