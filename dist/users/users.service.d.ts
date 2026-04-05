import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(data: Partial<User>): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findByRole(role: string): Promise<UserDocument[]>;
    update(id: string, data: Partial<User>): Promise<UserDocument>;
}
