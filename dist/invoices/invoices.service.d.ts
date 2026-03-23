import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
export declare class InvoicesService {
    private model;
    constructor(model: Model<InvoiceDocument>);
    findByBooking(bookingId: string): Promise<import("mongoose").Document<unknown, {}, InvoiceDocument, {}, {}> & Invoice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, InvoiceDocument, {}, {}> & Invoice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    generatePdf(bookingId: string, bookingData: any): Promise<Buffer>;
}
