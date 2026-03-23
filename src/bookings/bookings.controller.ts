import {
  Controller, Get, Post, Patch,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private svc: BookingsService) {}

  @Post()
  create(@Request() req, @Body() body) {
    return this.svc.create(req.user.sub, body);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  findAll(@Query() q) { return this.svc.findAll(q); }

  @Get('my')
  findMy(@Request() req) { return this.svc.findByUser(req.user.sub); }

  @Get('analytics')
  @UseGuards(RolesGuard)
  @Roles('admin')
  analytics() { return this.svc.getAnalytics(); }

  @Get(':id')
  findOne(@Param('id') id) { return this.svc.findById(id); }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  updateStatus(@Param('id') id, @Body() body, @Request() req) {
    return this.svc.updateStatus(id, body.status, req.user.role);
  }

  @Post(':id/pay-deposit')
  payDeposit(@Param('id') id, @Body() body, @Request() req) {
    return this.svc.payDeposit(id, req.user.sub, body.paymentMethod);
  }

  @Post(':id/pay-remaining')
  payRemaining(@Param('id') id, @Body() body, @Request() req) {
    return this.svc.payRemaining(id, req.user.sub, body.paymentMethod);
  }
}
