import { Model } from 'mongoose';
import { HallDocument } from './hall.schema';
export declare class HallsService {
    private hallModel;
    constructor(hallModel: Model<HallDocument>);
    create(data: any): Promise<HallDocument>;
    findAll(adminMode?: boolean): Promise<HallDocument[]>;
    findById(id: string): Promise<HallDocument>;
    findByManager(managerId: string): Promise<HallDocument[]>;
    update(id: string, data: any): Promise<HallDocument>;
    delete(id: string): Promise<void>;
    updateAvailability(id: string, dates: string[]): Promise<HallDocument>;
}
