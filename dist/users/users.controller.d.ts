import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./user.schema").UserDocument[]>;
    updateMe(req: any, body: any): Promise<import("./user.schema").UserDocument>;
}
