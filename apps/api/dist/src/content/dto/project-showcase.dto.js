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
exports.ProjectShowcaseDto = exports.ShowcaseLinkDto = exports.StatItemDto = exports.ArchitectureNodeDto = exports.FeatureItemDto = exports.ShowcaseItemDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class ShowcaseItemDto {
}
exports.ShowcaseItemDto = ShowcaseItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], ShowcaseItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], ShowcaseItemDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], ShowcaseItemDto.prototype, "icon", void 0);
class FeatureItemDto {
}
exports.FeatureItemDto = FeatureItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], FeatureItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], FeatureItemDto.prototype, "icon", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(180),
    __metadata("design:type", String)
], FeatureItemDto.prototype, "description", void 0);
class ArchitectureNodeDto {
}
exports.ArchitectureNodeDto = ArchitectureNodeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], ArchitectureNodeDto.prototype, "layer", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(180),
    __metadata("design:type", String)
], ArchitectureNodeDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(220),
    __metadata("design:type", String)
], ArchitectureNodeDto.prototype, "notes", void 0);
class StatItemDto {
}
exports.StatItemDto = StatItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], StatItemDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], StatItemDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], StatItemDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], StatItemDto.prototype, "source", void 0);
class ShowcaseLinkDto {
}
exports.ShowcaseLinkDto = ShowcaseLinkDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], ShowcaseLinkDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], ShowcaseLinkDto.prototype, "url", void 0);
class ProjectShowcaseDto {
}
exports.ProjectShowcaseDto = ProjectShowcaseDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ShowcaseItemDto),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "technologies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ShowcaseItemDto),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "tools", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ShowcaseItemDto),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "software", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(24),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FeatureItemDto),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "features", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ArchitectureNodeDto),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "architecture", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StatItemDto),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "stats", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(16),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ShowcaseLinkDto),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "links", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(220, { each: true }),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "challenges", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(220, { each: true }),
    __metadata("design:type", Array)
], ProjectShowcaseDto.prototype, "learnings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], ProjectShowcaseDto.prototype, "demoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], ProjectShowcaseDto.prototype, "videoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VideoProvider),
    __metadata("design:type", typeof (_a = typeof client_1.VideoProvider !== "undefined" && client_1.VideoProvider) === "function" ? _a : Object)
], ProjectShowcaseDto.prototype, "videoProvider", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProjectShowcaseDto.prototype, "videoAssetId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProjectShowcaseDto.prototype, "teamSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProjectShowcaseDto.prototype, "developmentTimeDays", void 0);
//# sourceMappingURL=project-showcase.dto.js.map