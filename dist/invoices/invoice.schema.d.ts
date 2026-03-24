import { Document, Types } from 'mongoose';
export type InvoiceDocument = Invoice & Document;
export declare class Invoice {
    bookingId: Types.ObjectId;
    invoiceNumber: string;
    pdfUrl: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
}
export declare const InvoiceSchema: any;
