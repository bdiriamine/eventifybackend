import { Model } from 'mongoose';
import { InvoiceDocument } from './invoice.schema';
export declare class InvoicesService {
    private model;
    constructor(model: Model<InvoiceDocument>);
    findByBooking(bookingId: string): Promise<import("mongoose").Query<any, any, {}, InvoiceDocument, "findOne", {}>>;
    findByUser(userId: string): Promise<import("mongoose").Query<any[], any, {}, InvoiceDocument, "find", {}>>;
    generatePdf(bookingId: string, bookingData: any): Promise<Buffer>;
}
