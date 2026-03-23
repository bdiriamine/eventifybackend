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
export declare const ServiceSchema: import("mongoose").Schema<Service, import("mongoose").Model<Service, any, any, any, Document<unknown, any, Service, any, {}> & Service & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Service, Document<unknown, {}, import("mongoose").FlatRecord<Service>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Service> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
