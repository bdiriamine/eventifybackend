import { ProductsService } from './products.service';
export declare class ProductsController {
    private svc;
    constructor(svc: ProductsService);
    findAll(admin?: string): Promise<import("./product.schema").ProductDocument[]>;
    findOne(id: string): Promise<import("./product.schema").ProductDocument>;
    create(body: any): Promise<import("./product.schema").ProductDocument>;
    update(id: string, body: any): Promise<import("./product.schema").ProductDocument>;
    delete(id: string): Promise<void>;
}
