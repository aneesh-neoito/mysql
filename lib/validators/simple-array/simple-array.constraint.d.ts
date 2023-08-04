import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsSimpleArrayConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(): string;
}
