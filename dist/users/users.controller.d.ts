import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{}>;
    updateMe(req: any, body: any): Promise<any>;
}
