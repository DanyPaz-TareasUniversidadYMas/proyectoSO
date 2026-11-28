import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProcessService } from './process.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { Auth } from '../auth/decorators';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post()
  @Auth()
  create(@Body() createProcessDto: CreateProcessDto) {
    return this.processService.create(createProcessDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.processService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.processService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProcessDto: UpdateProcessDto) {
    return this.processService.update(id, updateProcessDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.processService.remove(id);
  }
}
