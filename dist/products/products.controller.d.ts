import { ProductsService } from './products.service';
export declare class ProductsController {
    private svc;
    constructor(svc: ProductsService);
    findAll(admin?: string): Promise<{}>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    delete(id: string): Promise<void>;
}
