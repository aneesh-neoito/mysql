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
exports.MysqlCoreConfigDto = exports.MysqlCoreCacheConfigDto = exports.MysqlCoreCacheOptionsConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class MysqlCoreCacheOptionsConfigDto {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], MysqlCoreCacheOptionsConfigDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MysqlCoreCacheOptionsConfigDto.prototype, "host", void 0);
__decorate([
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], MysqlCoreCacheOptionsConfigDto.prototype, "port", void 0);
exports.MysqlCoreCacheOptionsConfigDto = MysqlCoreCacheOptionsConfigDto;
class MysqlCoreCacheConfigDto {
}
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsDefined(),
    class_transformer_1.Type(t => MysqlCoreCacheOptionsConfigDto),
    __metadata("design:type", MysqlCoreCacheOptionsConfigDto)
], MysqlCoreCacheConfigDto.prototype, "options", void 0);
exports.MysqlCoreCacheConfigDto = MysqlCoreCacheConfigDto;
class MysqlCoreConfigDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MysqlCoreConfigDto.prototype, "host", void 0);
__decorate([
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], MysqlCoreConfigDto.prototype, "port", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MysqlCoreConfigDto.prototype, "username", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MysqlCoreConfigDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MysqlCoreConfigDto.prototype, "database", void 0);
__decorate([
    class_validator_1.IsString({ each: true }),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], MysqlCoreConfigDto.prototype, "entities", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], MysqlCoreConfigDto.prototype, "synchronize", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], MysqlCoreConfigDto.prototype, "logging", void 0);
__decorate([
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], MysqlCoreConfigDto.prototype, "maxQueryExecutionTime", void 0);
__decorate([
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], MysqlCoreConfigDto.prototype, "migrations", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], MysqlCoreConfigDto.prototype, "migrationsRun", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MysqlCoreConfigDto.prototype, "migrationsTableName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], MysqlCoreConfigDto.prototype, "entityPrefix", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], MysqlCoreConfigDto.prototype, "poolSize", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.ValidateNested(),
    class_transformer_1.Type(t => MysqlCoreCacheConfigDto),
    __metadata("design:type", MysqlCoreCacheConfigDto)
], MysqlCoreConfigDto.prototype, "cache", void 0);
exports.MysqlCoreConfigDto = MysqlCoreConfigDto;
