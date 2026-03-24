import { Model } from 'mongoose';
import { InvoiceDocument } from './invoice.schema';
export declare class InvoicesService {
    private model;
    constructor(model: Model<InvoiceDocument>);
    findByBooking(bookingId: string): unknown;
    findByUser(userId: string): unknown;
    generatePdf(bookingId: string, bookingData: any): Promise<Buffer>;
}
