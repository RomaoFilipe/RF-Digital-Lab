"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    app.enableCors({
        origin: corsOrigin.split(',').map((o) => o.trim()),
        credentials: true,
    });
    const uploadDir = process.env.UPLOAD_DIR || (0, path_1.join)(process.cwd(), 'uploads');
    app.useStaticAssets(uploadDir, { prefix: '/uploads' });
    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen(port);
    console.log(`API listening on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map