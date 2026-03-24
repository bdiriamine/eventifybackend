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
    totalPrice: number;
    depositAmount: number;
    depositPaid: boolean;
    remainingAmount: number;
    remainingPaid: boolean;
    status: string;
    nationalId: string;
    acceptedTerms: boolean;
    paymentMethod: string;
    notes: string;
}
export declare const BookingSchema: any;
