export declare class MysqlCoreCacheOptionsConfigDto {
    name?: string;
    host: string;
    port: number;
}
export declare class MysqlCoreCacheConfigDto {
    options: MysqlCoreCacheOptionsConfigDto;
}
export declare class MysqlCoreConfigDto {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    synchronize: boolean;
    logging: boolean;
    maxQueryExecutionTime: number;
    migrations: string[];
    migrationsRun: boolean;
    migrationsTableName: string;
    entityPrefix?: string;
    poolSize: number;
    cache?: MysqlCoreCacheConfigDto;
}
