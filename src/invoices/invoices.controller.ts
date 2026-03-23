import { Controller, Get, Param, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BookingsService } from '../bookings/bookings.service';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoicesController {
  constructor(private invoicesService: InvoicesService, private bookingsService: BookingsService) {}

  @Get('my') findMy(@Request() req) { return this.invoicesService.findByUser(req.user.sub); }

  @Get('booking/:bookingId') findByBooking(@Param('bookingId') id: string) { return this.invoicesService.findByBooking(id); }

  @Get(':bookingId/download')
  async download(@Param('bookingId') bookingId: string, @Res() res: Response, @Request() req) {
    const booking = await this.bookingsService.findById(bookingId);
    const user = booking.userId as any;
    const pdfBuffer = await this.invoicesService.generatePdf(bookingId, {
      invoiceNumber: `INV-${bookingId.slice(-6).toUpperCase()}`,
      clientName: user?.name,
      nationalId: booking.nationalId,
      email: user?.email,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      location: booking.location,
      guestCount: booking.guestCount,
      totalPrice: booking.totalPrice,
      depositAmount: booking.depositAmount,
      remainingAmount: booking.remainingAmount,
    });
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename=facture-eventify-${bookingId.slice(-6)}.pdf`, 'Content-Length': pdfBuffer.length });
    res.end(pdfBuffer);
  }
}
