import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './booking.schema';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]), MailModule],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
