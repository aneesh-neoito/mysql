import { IHealthIndicator, IHealthIndicatorResult } from '@nestjs-nodo/health';
import { Connection } from 'typeorm';
export declare class MysqlHealth implements IHealthIndicator {
    private readonly connection;
    constructor(connection: Connection);
    getStatus(): Promise<IHealthIndicatorResult>;
}
