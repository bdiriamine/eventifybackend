import { Model } from 'mongoose';
import { ProductDocument } from './product.schema';
export declare class ProductsService {
    private model;
    constructor(model: Model<ProductDocument>);
    findAll(adminMode?: boolean): Promise<ProductDocument[]>;
    findById(id: string): Promise<ProductDocument>;
    create(data: any): Promise<ProductDocument>;
    update(id: string, data: any): Promise<ProductDocument>;
    delete(id: string): Promise<void>;
}
