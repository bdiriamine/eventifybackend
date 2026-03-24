import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private svc;
    constructor(svc: BookingsService);
    create(req: any, body: any): Promise<any>;
    findAll(q: any): Promise<{}>;
    findMy(req: any): Promise<{}>;
    analytics(): unknown;
    findOne(id: any): Promise<any>;
    updateStatus(id: any, body: any, req: any): Promise<any>;
    payDeposit(id: any, body: any, req: any): Promise<any>;
    payRemaining(id: any, body: any, req: any): Promise<any>;
}
