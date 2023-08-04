import { DynamicModule } from '@nestjs/common';
import { IHealthModuleAsyncOptions } from '@nestjs-nodo/health';
import { IMysqlConfigMap } from './types';
export declare class MysqlModule {
    static forHealthCheck(configMap: IMysqlConfigMap): IHealthModuleAsyncOptions;
    static forRoot(configMap: IMysqlConfigMap): DynamicModule;
    static forFeature(entities: Function[], configMap?: IMysqlConfigMap): DynamicModule;
}
