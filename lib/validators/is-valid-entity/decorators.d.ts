import { Type } from '@nestjs/common';
import { ValidationOptions } from 'class-validator';
import { BaseEntity } from '../../base-entity';
export declare function IsValidEntityId<T extends BaseEntity>(args: Type<T>, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
