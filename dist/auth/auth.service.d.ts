import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: any;
        accessToken: string;
    }>;
    login(email: string, password: string): Promise<{
        user: any;
        accessToken: string;
    }>;
    getMe(userId: string): Promise<any>;
    private sanitize;
}
