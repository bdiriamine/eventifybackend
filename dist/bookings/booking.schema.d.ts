import { Document, Types } from 'mongoose';
export type BookingDocument = Booking & Document;
export declare class Booking {
    userId: Types.ObjectId;
    eventType: string;
    eventDate: Date;
    location: string;
    guestCount: number;
    hallId: Types.ObjectId;
    services: any[];
    products: any[];
    juiceOrder?: any;
    carRental?: any;
    saleOrders: any[];
    totalPrice: number;
    depositAmount: number;
    depositPaid: boolean;
    remainingAmount: number;
    remainingPaid: boolean;
    paymentMethod: string;
    status: string;
    ownerNote: string;
    adminNote: string;
    clientNote: string;
    nationalId: string;
    acceptedTerms: boolean;
    notes: string;
}
export declare const BookingSchema: import("mongoose").Schema<Booking, import("mongoose").Model<Booking, any, any, any, Document<unknown, any, Booking, any, {}> & Booking & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Booking, Document<unknown, {}, import("mongoose").FlatRecord<Booking>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Booking> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
