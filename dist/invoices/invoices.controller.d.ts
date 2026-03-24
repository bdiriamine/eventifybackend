import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { BookingsService } from '../bookings/bookings.service';
export declare class InvoicesController {
    private invoicesService;
    private bookingsService;
    constructor(invoicesService: InvoicesService, bookingsService: BookingsService);
    findMy(req: any): unknown;
    findByBooking(id: string): unknown;
    download(bookingId: string, res: Response, req: any): any;
}
