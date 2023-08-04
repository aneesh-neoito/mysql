"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlLogger = void 0;
class MysqlLogger {
    constructor(logger) {
        this.logger = logger;
    }
    log(level, message, queryRunner) {
        switch (level) {
            case 'log':
                return this.logger.debug(message);
            case 'info':
                return this.logger.debug(message);
            case 'warn':
                return this.logger.warn(message);
        }
    }
    logMigration(message, queryRunner) {
        this.logger.log(message);
    }
    logQuery(query, parameters, queryRunner) {
        this.logger.debug(query, parameters && { parameters });
    }
    logQueryError(error, query, parameters, queryRunner) {
        this.logger.error(query, error, parameters && { parameters });
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        this.logger.warn(query, { time, parameters });
    }
    logSchemaBuild(message, queryRunner) {
        this.logger.info(message);
    }
}
exports.MysqlLogger = MysqlLogger;
