import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare enum UserRole {
    CLIENT = "client",
    ADMIN = "admin",
    MANAGER = "manager"
}
export declare class User {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    nationalId: string;
    phone: string;
    city: string;
    avatar: string;
}
export declare const UserSchema: any;
