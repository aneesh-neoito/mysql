import { MysqlCoreConfigDto } from './mysql-core-config.dto';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { SelectQueryBuilder } from 'typeorm';
import { IBuildFullTextSearchQuery } from './types';
import { BaseEntity } from './base-entity';
export declare const MysqlUtils: {
    buildTypeOrmConfig(config: MysqlCoreConfigDto): TypeOrmModuleOptions;
    escapeStringForFullTextSearch(value: string): string;
    createFullTextSearchParam(value: string): string;
    buildFullTextSearchQuery<T extends BaseEntity>(queryBuilder: SelectQueryBuilder<T>, params: IBuildFullTextSearchQuery): SelectQueryBuilder<T>;
    prepareQueryBuilderForPagination<T_1 extends BaseEntity>(queryBuilder: SelectQueryBuilder<T_1>, params: IBuildFullTextSearchQuery): SelectQueryBuilder<T_1>[];
    formatPaginationResponse<T_2 extends BaseEntity>(rows: T_2[], total: number, params: IBuildFullTextSearchQuery): {
        rows: T_2[];
        count: number;
        total: number;
        links: any;
    };
    paginate<T_3 extends BaseEntity>(qb: SelectQueryBuilder<T_3>, params: IBuildFullTextSearchQuery): Promise<{
        rows: T_3[];
        count: number;
        total: number;
        links: any;
    }>;
    reshapeToObj(obj: any, key: any, value: any): any;
    mapper(row: any): Record<string, any>;
    paginateRaw<T_4 extends BaseEntity>(qb: SelectQueryBuilder<T_4>, params: IBuildFullTextSearchQuery, customMapper?: ((row: any) => any) | undefined): Promise<{
        rows: any[];
        count: number;
        total: number;
        links: any;
    }>;
    selectAsArrayAggregation(joinAlias: string, columns: string[], asAlias?: string): string;
    selectAsObjectAggregation(joinAlias: string, columns: string[], asAlias?: string): string;
};
