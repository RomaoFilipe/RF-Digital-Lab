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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AdminSeedService = class AdminSeedService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!email || !password) {
            return;
        }
        const existing = await this.prisma.adminUser.findUnique({ where: { email } });
        if (!existing) {
            const passwordHash = await bcrypt.hash(password, 10);
            await this.prisma.adminUser.create({
                data: { email, passwordHash },
            });
        }
        const settingsCount = await this.prisma.siteSettings.count();
        if (settingsCount === 0) {
            await this.prisma.siteSettings.create({ data: {} });
        }
    }
};
exports.AdminSeedService = AdminSeedService;
exports.AdminSeedService = AdminSeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSeedService);
//# sourceMappingURL=admin-seed.service.js.map