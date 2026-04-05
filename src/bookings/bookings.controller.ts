import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
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

  /* Client: create a booking request */
  @Post()
  create(@Request() req, @Body() body: any) {
    return this.svc.create(req.user.sub, body);
  }

  /* Admin + Manager: get all bookings */
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  findAll(@Query() q: any) { return this.svc.findAll(q); }

  /* Client: get own bookings */
  @Get('my')
  findMy(@Request() req) { return this.svc.findByUser(req.user.sub); }

  /* Admin only: analytics */
  @Get('analytics')
  @UseGuards(RolesGuard)
  @Roles('admin')
  analytics() { return this.svc.getAnalytics(); }

  /* Get single booking */
  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findById(id); }

  /* Owner (manager): approve or reject */
  @Post(':id/owner-decision')
  @UseGuards(RolesGuard)
  @Roles('manager', 'admin')
  ownerDecision(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.svc.ownerDecision(id, req.user.sub, Boolean(body.approved), body.note);
  }

  /* Admin: validate after owner approved */
  @Post(':id/admin-decision')
  @UseGuards(RolesGuard)
  @Roles('admin')
  adminDecision(@Param('id') id: string, @Body() body: any) {
    return this.svc.adminDecision(id, Boolean(body.approved), body.note);
  }

  /* Client: pay deposit (only when status = AwaitingPayment) */
  @Post(':id/pay-deposit')
  payDeposit(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.svc.payDeposit(id, req.user.sub, body.paymentMethod);
  }

  /* Client: pay remaining */
  @Post(':id/pay-remaining')
  payRemaining(@Param('id') id: string, @Request() req) {
    return this.svc.payRemaining(id, req.user.sub);
  }

  /* Admin: force status change */
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  updateStatus(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.svc.updateStatus(id, body.status, req.user.role);
  }
}
