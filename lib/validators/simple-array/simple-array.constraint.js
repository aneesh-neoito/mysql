"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSimpleArrayConstraint = void 0;
const class_validator_1 = require("class-validator");
let IsSimpleArrayConstraint = class IsSimpleArrayConstraint {
    validate(value, args) {
        if (!Array.isArray(value) || value.find(v => typeof v !== 'string')) {
            return false;
        }
        return value.findIndex(elem => elem.includes(',')) === -1;
    }
    defaultMessage() {
        return 'Must be an array and values must not contain commas';
    }
};
IsSimpleArrayConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ name: 'IsSimpleArray' })
], IsSimpleArrayConstraint);
exports.IsSimpleArrayConstraint = IsSimpleArrayConstraint;
