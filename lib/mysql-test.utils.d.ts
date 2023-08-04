import { BaseEntity } from './base-entity';
export declare const MysqlTestUtils: {
    deepClean<T extends object>(o: T, fs: string[]): void;
    deepCleanBaseEntity<T_1 extends BaseEntity>(o: T_1): void;
    getPlainObject<T_2 extends object>(entity: T_2, replacer?: object): any;
    cleanDB(connectionName?: string | undefined): Promise<void>;
    runInSandbox(cb: (...args: any[]) => any, connectionName?: string): (...args: any[]) => Promise<any>;
};
