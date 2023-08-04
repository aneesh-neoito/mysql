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
exports.PaginationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class PaginationDto {
    constructor() {
        this.limit = 50;
        this.skip = 0;
    }
}
__decorate([
    class_transformer_1.Type(() => Number),
    class_validator_1.IsInt(),
    class_validator_1.IsOptional(),
    class_validator_1.Min(1),
    class_validator_1.Max(1000000),
    swagger_1.ApiProperty({ type: Number, minimum: 1, maximum: 1000000, default: 50 }),
    __metadata("design:type", Object)
], PaginationDto.prototype, "limit", void 0);
__decorate([
    class_transformer_1.Type(() => Number),
    class_validator_1.IsInt(),
    class_validator_1.IsOptional(),
    class_validator_1.Min(0),
    class_validator_1.Max(1000000),
    swagger_1.ApiProperty({ type: Number, minimum: 0, maximum: 1000000, default: 0 }),
    __metadata("design:type", Object)
], PaginationDto.prototype, "skip", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({ type: String, required: false }),
    __metadata("design:type", String)
], PaginationDto.prototype, "sort", void 0);
__decorate([
    class_validator_1.IsIn(['ASC', 'DESC']),
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({ enum: ['ASC', 'DESC'], required: false }),
    __metadata("design:type", String)
], PaginationDto.prototype, "order", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PaginationDto.prototype, "path", void 0);
exports.PaginationDto = PaginationDto;
