"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin seed.');
        return;
    }
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (!existing) {
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        await prisma.adminUser.create({
            data: {
                email,
                passwordHash,
            },
        });
        console.log('Admin user created:', email);
    }
    else {
        console.log('Admin user already exists:', email);
    }
    const settingsCount = await prisma.siteSettings.count();
    if (settingsCount === 0) {
        await prisma.siteSettings.create({ data: {} });
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map