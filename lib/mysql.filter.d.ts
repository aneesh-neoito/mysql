import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Logger } from '@nestjs-nodo/log';
export declare class MysqlFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: Logger);
    catch(exception: any, host: ArgumentsHost): any;
}
