"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidEntityId = void 0;
const class_validator_1 = require("class-validator");
const is_valid_entity_id_constraint_1 = require("./is-valid-entity-id.constraint");
function IsValidEntityId(args, validationOptions) {
    return (object, propertyName) => {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [args],
            validator: is_valid_entity_id_constraint_1.IsValidEntityIdConstraint,
        });
    };
}
exports.IsValidEntityId = IsValidEntityId;
