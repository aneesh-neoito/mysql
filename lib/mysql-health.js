"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlHealth = void 0;
const common_1 = require("@nestjs/common");
class MysqlHealth {
    constructor(connection) {
        this.connection = connection;
    }
    async getStatus() {
        if (!this.connection.isConnected) {
            throw new common_1.InternalServerErrorException('Mysql not connected');
        }
        return {
            name: `mysql (${this.connection.name})`,
            details: {
                connected: this.connection.isConnected,
            },
        };
    }
}
exports.MysqlHealth = MysqlHealth;
