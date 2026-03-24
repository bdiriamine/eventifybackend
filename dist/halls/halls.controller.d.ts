import { HallsService } from './halls.service';
export declare class HallsController {
    private hallsService;
    constructor(hallsService: HallsService);
    findAll(admin?: string): Promise<import("./hall.schema").HallDocument[]>;
    findMyHalls(req: any): Promise<import("./hall.schema").HallDocument[]>;
    findOne(id: string): Promise<import("./hall.schema").HallDocument>;
    create(body: any): Promise<import("./hall.schema").HallDocument>;
    update(id: string, body: any): Promise<import("./hall.schema").HallDocument>;
    updateAvailability(id: string, body: any): Promise<import("./hall.schema").HallDocument>;
    delete(id: string): Promise<void>;
}
