import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HallsService } from './halls.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private hallsService: HallsService) {}

  @Get()
  findAll(@Query('admin') admin?: string) {
    return this.hallsService.findAll(admin === 'true');
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'admin')
  @ApiBearerAuth()
  findMyHalls(@Request() req) {
    return this.hallsService.findByManager(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.hallsService.findById(id); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  create(@Body() body: any) { return this.hallsService.create(body); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) {
    return this.hallsService.update(id, body);
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  updateAvailability(@Param('id') id: string, @Body() body: any) {
    return this.hallsService.updateAvailability(id, body.dates);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  delete(@Param('id') id: string) { return this.hallsService.delete(id); }
}
