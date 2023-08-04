import { RQLQuery } from '@swimlane/rql';
import { SelectQueryBuilder } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { TRqlJson } from './rql-builder';
export interface IWalkParams {
    sort?: Record<string, 'ASC' | 'DESC'>;
    limit?: number | null;
    offset?: number | null;
    getColumnName?: (column: string) => string;
}
export declare class RqlTypeOrmError extends BadRequestException {
    constructor(rql: RQLQuery, message: string);
}
export declare class RqlTypeOrm {
    private readonly rql;
    private readonly root;
    constructor(rql: string | RQLQuery | TRqlJson | TRqlJson[]);
    execute<T>(qb: SelectQueryBuilder<T>, getColumnName?: (n: string) => string): IWalkParams;
    private internalExecute;
    private walk;
    private getFullColumnName;
}
