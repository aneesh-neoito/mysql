"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MysqlCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlCoreModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs-nodo/config");
const mysql_logger_1 = require("./mysql-logger");
const log_1 = require("@nestjs-nodo/log");
const typeorm_transactional_cls_hooked_1 = require("typeorm-transactional-cls-hooked");
const core_1 = require("@nestjs/core");
const mysql_filter_1 = require("./mysql.filter");
const utils_1 = require("./utils");
typeorm_transactional_cls_hooked_1.initializeTransactionalContext();
let MysqlCoreModule = MysqlCoreModule_1 = class MysqlCoreModule {
    static forRoot(configMap) {
        return {
            module: MysqlCoreModule_1,
            imports: [
                log_1.LogModule.forFeature(mysql_filter_1.MysqlFilter),
                typeorm_1.TypeOrmModule.forRootAsync({
                    name: configMap.connectionName,
                    imports: [
                        config_1.ConfigModule.forFeature(configMap),
                        log_1.LogModule.forFeature(MysqlCoreModule_1),
                    ],
                    inject: [config_1.getConfigToken(configMap), log_1.getLoggerToken(MysqlCoreModule_1)],
                    useFactory: (config, logger) => {
                        logger.warn('Starting new connection...', { name: configMap.connectionName });
                        return Object.assign(Object.assign({ logger: new mysql_logger_1.MysqlLogger(logger), name: configMap.connectionName }, utils_1.MysqlUtils.buildTypeOrmConfig(config)), { entities: configMap.entities || config.entities || [] });
                    },
                }),
            ],
            providers: configMap.useFilter ? [
                {
                    provide: core_1.APP_FILTER,
                    useClass: mysql_filter_1.MysqlFilter
                },
            ] : [],
            exports: [typeorm_1.TypeOrmModule, log_1.LogModule],
        };
    }
};
MysqlCoreModule = MysqlCoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], MysqlCoreModule);
exports.MysqlCoreModule = MysqlCoreModule;
