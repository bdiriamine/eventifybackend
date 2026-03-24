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
export declare const InvoiceSchema: import("mongoose").Schema<Invoice, import("mongoose").Model<Invoice, any, any, any, Document<unknown, any, Invoice, any, {}> & Invoice & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invoice, Document<unknown, {}, import("mongoose").FlatRecord<Invoice>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Invoice> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
