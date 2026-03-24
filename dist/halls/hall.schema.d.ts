import { Document, Types } from 'mongoose';
export type HallDocument = Hall & Document;
export declare class Hall {
    name: string;
    location: string;
    capacity: number;
    price: number;
    description: string;
    images: string[];
    availabilityCalendar: string[];
    managerId: Types.ObjectId;
    rating: number;
    reviewCount: number;
    tags: string[];
    isActive: boolean;
}
export declare const HallSchema: any;
