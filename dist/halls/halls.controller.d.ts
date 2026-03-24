import { HallsService } from './halls.service';
export declare class HallsController {
    private hallsService;
    constructor(hallsService: HallsService);
    findAll(admin?: string): Promise<{}>;
    findMyHalls(req: any): Promise<{}>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    updateAvailability(id: string, body: any): Promise<any>;
    delete(id: string): Promise<void>;
}
