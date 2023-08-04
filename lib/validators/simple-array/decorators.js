"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSimpleArray = void 0;
const class_validator_1 = require("class-validator");
const simple_array_constraint_1 = require("./simple-array.constraint");
function IsSimpleArray(validationOptions) {
    return (object, propertyName) => {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: simple_array_constraint_1.IsSimpleArrayConstraint,
        });
    };
}
exports.IsSimpleArray = IsSimpleArray;
