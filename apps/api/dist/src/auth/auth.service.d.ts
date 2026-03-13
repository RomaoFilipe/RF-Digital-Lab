import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    validateAdmin(email: string, password: string): Promise<any>;
    signToken(userId: number, email: string): Promise<any>;
    login(email: string, password: string): Promise<{
        token: any;
        user: {
            id: any;
            email: any;
        };
    }>;
    getMe(userId: number): Promise<{
        id: any;
        email: any;
        lastLoginAt: any;
    }>;
    cookieOptions(): {
        httpOnly: boolean;
        sameSite: "lax";
        secure: boolean;
        domain: any;
        path: string;
        maxAge: number;
    };
}
