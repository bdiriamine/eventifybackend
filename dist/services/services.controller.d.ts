import { ServicesService } from './services.service';
export declare class ServicesController {
    private svc;
    constructor(svc: ServicesService);
    findAll(admin?: string): Promise<import("./service.schema").ServiceDocument[]>;
    findOne(id: string): Promise<import("./service.schema").ServiceDocument>;
    create(body: any): Promise<import("./service.schema").ServiceDocument>;
    update(id: string, body: any): Promise<import("./service.schema").ServiceDocument>;
    delete(id: string): Promise<void>;
}
