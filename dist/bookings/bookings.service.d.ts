import { Model } from 'mongoose';
import { BookingDocument } from './booking.schema';
export declare class BookingsService {
    private model;
    constructor(model: Model<BookingDocument>);
    create(userId: string, data: any): Promise<BookingDocument>;
    ownerDecision(id: string, ownerId: string, approved: boolean, note?: string): Promise<BookingDocument>;
    adminDecision(id: string, approved: boolean, note?: string): Promise<BookingDocument>;
    payDeposit(id: string, userId: string, paymentMethod: string): Promise<BookingDocument>;
    updateStatus(id: string, status: string, userRole: string): Promise<BookingDocument>;
    payRemaining(id: string, userId: string): Promise<BookingDocument>;
    findAll(query?: any): Promise<BookingDocument[]>;
    findByUser(userId: string): Promise<BookingDocument[]>;
    findById(id: string): Promise<BookingDocument>;
    getAnalytics(): Promise<{
        total: number;
        pending: number;
        ownerPending: number;
        revenue: any;
        byType: any[];
        byMonth: any[];
    }>;
}
