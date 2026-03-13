"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async validateAdmin(email, password) {
        const user = await this.prisma.adminUser.findUnique({ where: { email } });
        if (!user)
            return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            return null;
        await this.prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        return user;
    }
    async signToken(userId, email) {
        return this.jwt.signAsync({ sub: userId, email });
    }
    async login(email, password) {
        const user = await this.validateAdmin(email, password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = await this.signToken(user.id, user.email);
        return { token, user: { id: user.id, email: user.email } };
    }
    async getMe(userId) {
        const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid session');
        return { id: user.id, email: user.email, lastLoginAt: user.lastLoginAt };
    }
    cookieOptions() {
        const secure = process.env.NODE_ENV === 'production';
        const domain = process.env.COOKIE_DOMAIN || undefined;
        return {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            domain,
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map