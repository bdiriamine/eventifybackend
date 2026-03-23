import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { BookingsService } from '../bookings/bookings.service';
export declare class InvoicesController {
    private invoicesService;
    private bookingsService;
    constructor(invoicesService: InvoicesService, bookingsService: BookingsService);
    findMy(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./invoice.schema").InvoiceDocument, {}, {}> & import("./invoice.schema").Invoice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findByBooking(id: string): Promise<import("mongoose").Document<unknown, {}, import("./invoice.schema").InvoiceDocument, {}, {}> & import("./invoice.schema").Invoice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    download(bookingId: string, res: Response, req: any): Promise<void>;
}
