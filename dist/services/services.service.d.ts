import { Model } from 'mongoose';
import { ServiceDocument } from './service.schema';
export declare class ServicesService {
    private model;
    constructor(model: Model<ServiceDocument>);
    findAll(adminMode?: boolean): Promise<ServiceDocument[]>;
    findById(id: string): Promise<ServiceDocument>;
    create(data: any): Promise<ServiceDocument>;
    update(id: string, data: any): Promise<ServiceDocument>;
    delete(id: string): Promise<void>;
}
