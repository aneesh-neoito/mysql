import { IConfigMap } from '@nestjs-nodo/config';
import { QueryDto } from './dto/query.dto';
import { MysqlCoreConfigDto } from './mysql-core-config.dto';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
export interface IMysqlConfigMap extends IConfigMap<MysqlCoreConfigDto> {
    connectionName: string;
    useFilter: boolean;
    entities?: ((Function | string | EntitySchema<any>))[];
}
export interface IBuildFullTextSearchQuery extends QueryDto {
    field: string;
}
