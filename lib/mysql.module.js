"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MysqlModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mysql_core_module_1 = require("./mysql-core.module");
const mysql_health_1 = require("./mysql-health");
let MysqlModule = MysqlModule_1 = class MysqlModule {
    static forHealthCheck(configMap) {
        return {
            imports: [],
            healthIndicators: [
                {
                    provide: mysql_health_1.MysqlHealth,
                    inject: [typeorm_1.getConnectionToken(configMap.connectionName)],
                    useFactory: (connection) => {
                        return new mysql_health_1.MysqlHealth(connection);
                    },
                },
            ],
        };
    }
    static forRoot(configMap) {
        return {
            module: MysqlModule_1,
            imports: [mysql_core_module_1.MysqlCoreModule.forRoot(configMap)],
        };
    }
    static forFeature(entities, configMap) {
        return {
            module: MysqlModule_1,
            imports: [typeorm_1.TypeOrmModule.forFeature(entities, configMap === null || configMap === void 0 ? void 0 : configMap.connectionName)],
            exports: [typeorm_1.TypeOrmModule],
        };
    }
};
MysqlModule = MysqlModule_1 = __decorate([
    common_1.Module({})
], MysqlModule);
exports.MysqlModule = MysqlModule;
