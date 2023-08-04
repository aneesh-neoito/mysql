"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MysqlFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const EntityNotFoundError_1 = require("typeorm/error/EntityNotFoundError");
const log_1 = require("@nestjs-nodo/log");
const EXCEPTION_CODES = {
    ER_INTERNAL: {
        code: 'INTERNAL',
        status: 500,
    },
    ER_DUP_ENTRY: {
        code: 'DUP_ENTRY',
        status: 409,
    },
    ER_NOT_FOUND: {
        code: 'NOT_FOUND',
        status: 404
    },
    ER_NON_UNIQ_ERROR: {
        code: 'NON_UNIQ_ERROR',
        status: 400,
    }
};
let MysqlFilter = MysqlFilter_1 = class MysqlFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        let err;
        let msg = 'Something went wrong.';
        if (exception instanceof typeorm_1.QueryFailedError) {
            err = EXCEPTION_CODES[exception.code] || EXCEPTION_CODES.ER_INTERNAL;
            msg = exception.sqlMessage || exception.message || 'Something went wrong.';
        }
        else if (exception instanceof EntityNotFoundError_1.EntityNotFoundError) {
            err = EXCEPTION_CODES.ER_NOT_FOUND;
            msg = exception.message || 'Not found';
        }
        else {
            err = EXCEPTION_CODES.ER_INTERNAL;
        }
        const response = {
            message: [
                {
                    constraints: {
                        [err.code]: msg,
                    }
                }
            ],
            stack: process.env.NODE_ENV !== 'production' ? exception.stack : undefined,
        };
        if (err.status >= 500) {
            this.logger.error(exception.message, exception, { url: host.switchToHttp().getRequest().originalUrl });
        }
        else {
            this.logger.warn(exception.message, Object.assign({ url: host.switchToHttp().getRequest().originalUrl }, exception));
        }
        return host
            .switchToHttp()
            .getResponse()
            .status(err.status)
            .send(response);
    }
};
MysqlFilter = MysqlFilter_1 = __decorate([
    common_1.Catch(typeorm_1.QueryFailedError, EntityNotFoundError_1.EntityNotFoundError),
    __param(0, log_1.InjectLogger(MysqlFilter_1)),
    __metadata("design:paramtypes", [log_1.Logger])
], MysqlFilter);
exports.MysqlFilter = MysqlFilter;
