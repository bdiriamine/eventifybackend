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
        revenue: any;
        byType: any[];
        byMonth: any[];
    }>;
    findOne(id: any): Promise<import("./booking.schema").BookingDocument>;
    updateStatus(id: any, body: any, req: any): Promise<import("./booking.schema").BookingDocument>;
    payDeposit(id: any, body: any, req: any): Promise<import("./booking.schema").BookingDocument>;
    payRemaining(id: any, body: any, req: any): Promise<import("./booking.schema").BookingDocument>;
}
