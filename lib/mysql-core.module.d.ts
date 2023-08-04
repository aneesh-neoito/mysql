import { DynamicModule } from '@nestjs/common';
import { IMysqlConfigMap } from './types';
export declare class MysqlCoreModule {
    static forRoot(configMap: IMysqlConfigMap): DynamicModule;
}
