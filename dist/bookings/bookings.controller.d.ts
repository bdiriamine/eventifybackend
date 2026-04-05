import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private svc;
    constructor(svc: BookingsService);
    create(req: any, body: any): Promise<import("./booking.schema").BookingDocument>;
    findAll(q: any): Promise<import("./booking.schema").BookingDocument[]>;
    findMy(req: any): Promise<import("./booking.schema").BookingDocument[]>;
    analytics(): Promise<{
        total: number;
        pending: number;
        ownerPending: number;
        revenue: any;
        byType: any[];
        byMonth: any[];
    }>;
    findOne(id: string): Promise<import("./booking.schema").BookingDocument>;
    ownerDecision(id: string, body: any, req: any): Promise<import("./booking.schema").BookingDocument>;
    adminDecision(id: string, body: any): Promise<import("./booking.schema").BookingDocument>;
    payDeposit(id: string, body: any, req: any): Promise<import("./booking.schema").BookingDocument>;
    payRemaining(id: string, req: any): Promise<import("./booking.schema").BookingDocument>;
    updateStatus(id: string, body: any, req: any): Promise<import("./booking.schema").BookingDocument>;
}
