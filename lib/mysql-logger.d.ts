import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs-nodo/log';
export declare class MysqlLogger implements TypeOrmLogger {
    private readonly logger;
    constructor(logger: Logger);
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any;
    logMigration(message: string, queryRunner?: QueryRunner): any;
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any;
}
