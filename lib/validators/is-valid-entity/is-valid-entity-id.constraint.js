"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidEntityIdConstraint = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_transactional_cls_hooked_1 = require("typeorm-transactional-cls-hooked");
let IsValidEntityIdConstraint = class IsValidEntityIdConstraint {
    async validate(entityId, args) {
        const tEntity = args.constraints[0];
        // FIXME connection name 'default' should not be hardcoded
        const manager = typeorm_transactional_cls_hooked_1.getEntityManagerOrTransactionManager('default', typeorm_1.getConnection().manager);
        const entity = await manager.findOne(tEntity, { id: entityId });
        if (!entity) {
            this.message = `could not find entity of type=${tEntity.name} and id=${entityId}`;
            return false;
        }
        return true;
    }
    defaultMessage() {
        return this.message || 'Entity is not valid.';
    }
};
IsValidEntityIdConstraint = __decorate([
    class_validator_1.ValidatorConstraint({
        async: true,
        name: 'IsValidEntityConstraint',
    }),
    common_1.Injectable()
], IsValidEntityIdConstraint);
exports.IsValidEntityIdConstraint = IsValidEntityIdConstraint;
