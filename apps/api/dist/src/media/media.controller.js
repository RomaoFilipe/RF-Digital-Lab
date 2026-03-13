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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const media_service_1 = require("./media.service");
const auth_guard_1 = require("../auth/auth.guard");
const client_1 = require("@prisma/client");
const FOLDERS = new Set(['images', 'videos', 'files', 'covers']);
function ensureDir(path) {
    if (!(0, fs_1.existsSync)(path))
        (0, fs_1.mkdirSync)(path, { recursive: true });
}
function kindFromMime(mime) {
    if (mime.startsWith('image/'))
        return client_1.MediaKind.IMAGE;
    if (mime.startsWith('video/'))
        return client_1.MediaKind.VIDEO;
    return client_1.MediaKind.FILE;
}
let MediaController = class MediaController {
    constructor(media) {
        this.media = media;
    }
    list(query) {
        return this.media.list(query);
    }
    async upload(file, folder) {
        const safeFolder = FOLDERS.has(String(folder)) ? String(folder) : 'images';
        const relativePath = `/uploads/${safeFolder}/${file.filename}`;
        const created = await this.media.createMedia({
            kind: kindFromMime(file.mimetype),
            path: relativePath,
            originalName: file.originalname,
            mime: file.mimetype,
            size: file.size,
        });
        return created;
    }
    remove(id) {
        return this.media.removeMedia(id);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, _file, cb) => {
                const uploadDir = process.env.UPLOAD_DIR || (0, path_1.join)(process.cwd(), 'uploads');
                const folder = String(req.query.folder || 'images');
                const safeFolder = FOLDERS.has(folder) ? folder : 'images';
                const dest = (0, path_1.join)(uploadDir, safeFolder);
                ensureDir(dest);
                cb(null, dest);
            },
            filename: (_req, file, cb) => {
                const ext = (0, path_1.extname)(file.originalname) || '';
                cb(null, `${(0, crypto_1.randomUUID)()}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "upload", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "remove", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map