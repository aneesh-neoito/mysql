export declare type TPrimitive = string | boolean | number | Date;
export declare type IRqlJsonArg = TPrimitive[] | TPrimitive | TRqlJson;
export declare type TRqlJson = IRqlSort | IRqlInOutArg | IRqlContainsExcludes | IRqlLimit | IRqlAndOr | IRqlCompare;
export interface IRqlSort {
    name: 'sort';
    args: string[];
}
export interface IRqlInOutArg {
    name: 'in' | 'out';
    args: [string, TPrimitive[]];
}
export interface IRqlContainsExcludes {
    name: 'contains' | 'excludes';
    args: [string, TRqlJson];
}
export interface IRqlLimit {
    name: 'limit';
    args: [number, number];
}
export interface IRqlAndOr {
    name: 'and' | 'or';
    args: TRqlJson[];
}
export interface IRqlCompare {
    name: 'eq' | 'ne' | 'lt' | 'le' | 'gt' | 'ge';
    args: [string, TPrimitive];
}
export declare function RQL(json: TRqlJson | TRqlJson[]): string;
