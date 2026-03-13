import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(dto: LoginDto, res: Response): Promise<any>;
    logout(res: Response): Promise<any>;
    me(req: Request): Promise<{
        id: any;
        email: any;
        lastLoginAt: any;
    }>;
}
