import { Document } from 'mongoose';
export type ServiceDocument = Service & Document;
export declare class Service {
    name: string;
    description: string;
    price: number;
    priceUnit: string;
    category: string;
    features: string[];
    images: string[];
    eventTypes: string[];
    isActive: boolean;
}
export declare const ServiceSchema: any;
