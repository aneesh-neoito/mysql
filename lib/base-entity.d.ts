import { BaseEntity as SuperBaseEntity } from 'typeorm';
export declare abstract class BaseEntity extends SuperBaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
