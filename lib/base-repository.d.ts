import { BaseRepository as TypeormBaseRepository } from 'typeorm-transactional-cls-hooked';
import { ObjectLiteral } from 'typeorm';
export declare class BaseRepository<Entity extends ObjectLiteral> extends TypeormBaseRepository<Entity> {
}
