import { Model } from 'mongoose';
import { BookingDocument } from './booking.schema';
export declare class BookingsService {
    private model;
    constructor(model: Model<BookingDocument>);
    create(userId: string, data: any): Promise<BookingDocument>;
    findAll(query?: any): Promise<BookingDocument[]>;
    findByUser(userId: string): Promise<BookingDocument[]>;
    findById(id: string): Promise<BookingDocument>;
    updateStatus(id: string, status: string, userRole: string): Promise<BookingDocument>;
    payDeposit(id: string, userId: string, paymentMethod: string): Promise<BookingDocument>;
    payRemaining(id: string, userId: string, paymentMethod: string): Promise<BookingDocument>;
    getAnalytics(): Promise<{
        total: number;
        pending: number;
        revenue: any;
        byType: any[];
        byMonth: any[];
    }>;
}
