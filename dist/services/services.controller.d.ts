import { ServicesService } from './services.service';
export declare class ServicesController {
    private svc;
    constructor(svc: ServicesService);
    findAll(admin?: string): Promise<{}>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    delete(id: string): Promise<void>;
}
