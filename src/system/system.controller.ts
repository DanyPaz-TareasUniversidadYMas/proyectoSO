import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemService } from './system.service';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { Auth } from '../auth/decorators';
import { UserRoles } from '../users/enums';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post()
  @Auth(UserRoles.ADMIN)
  create(@Body() createSystemDto: CreateSystemDto) {
    return this.systemService.create(createSystemDto);
  }

  @Get()
  @Auth(UserRoles.ADMIN)
  findAll() {
    return this.systemService.findAll();
  }

  @Get(':id')
  @Auth(UserRoles.ADMIN)

  findOne(@Param('id') id: string) {
    return this.systemService.findOne(+id);
  }

  @Patch(':id')
  @Auth(UserRoles.ADMIN)
  update(@Param('id') id: string, @Body() updateSystemDto: UpdateSystemDto) {
    return this.systemService.update(+id, updateSystemDto);
  }

  @Delete(':id')
  @Auth(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.systemService.remove(+id);
  }
}
