import { Document } from 'mongoose';
export type ProductDocument = Product & Document;
export declare class Product {
    name: string;
    description: string;
    price: number;
    priceUnit: string;
    icon: string;
    category: string;
    stock: number;
    images: string[];
    rentalAvailable: boolean;
    isActive: boolean;
}
export declare const ProductSchema: any;
