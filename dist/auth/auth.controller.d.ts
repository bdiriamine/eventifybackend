import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: any;
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: any;
        accessToken: string;
    }>;
    getMe(req: any): Promise<any>;
}
