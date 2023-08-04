import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsValidEntityIdConstraint implements ValidatorConstraintInterface {
    private message?;
    validate(entityId: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(): string;
}
