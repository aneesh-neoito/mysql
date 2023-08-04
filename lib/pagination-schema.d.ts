import { QueryBuilder, Repository } from 'typeorm';
import { RQLQuery } from '@swimlane/rql';
import { TRqlJson } from './rql-builder';
import { BaseEntity } from './base-entity';
export declare type JSONValue = string | IJSONObject | IJSONArray;
export interface IJSONObject extends Record<string, JSONValue> {
}
export interface IJSONArray extends Array<IJSONObject> {
}
export declare class PaginationSchema<T extends BaseEntity> {
    private readonly repository;
    private tablePaths;
    private schema;
    private relations;
    private qbFactory;
    private fields;
    private jsonFields;
    constructor(repository: Repository<T>);
    withQuery(fn: (qb: QueryBuilder<T>) => void): this;
    paginate(rql: string | RQLQuery | TRqlJson | TRqlJson[]): Promise<{
        count: number;
        rows: any[];
    }>;
    private collectMetadata;
    private buildSchema;
    private buildSelectFields;
    private asAlias;
    private getTableAlias;
    private translateTableName;
    private postProcessRows;
}
