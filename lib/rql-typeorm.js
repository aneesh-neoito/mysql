"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RqlTypeOrm = exports.RqlTypeOrmError = void 0;
const rql_1 = require("@swimlane/rql");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const rql_builder_1 = require("./rql-builder");
function normalizeLimitSkip(value) {
    if (typeof value === 'number') {
        return Math.round(value);
    }
    else if (typeof value === 'string') {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
            return 0;
        }
        return intValue;
    }
    else if (value === void 0 || value === null) {
        return null;
    }
    return 0;
}
function createParamName(property, filter) {
    const rnd = Math.round(Math.random() * 1000000);
    return `${property}_${filter}_${rnd}`.replace(/[^a-z0-9]/gi, '_');
}
class RqlTypeOrmError extends common_1.BadRequestException {
    constructor(rql, message) {
        super({ message, rql }, message);
    }
}
exports.RqlTypeOrmError = RqlTypeOrmError;
// tslint:disable-next-line:max-classes-per-file
class RqlTypeOrm {
    constructor(rql) {
        this.rql = rql;
        if (typeof rql === 'string') {
            if (!rql_1.isRQLQuery(rql)) {
                throw new common_1.BadRequestException(undefined, 'RQL should be a valida rql string');
            }
            this.root = rql_1.RQLQuery.parse(rql);
        }
        else if (rql instanceof rql_1.RQLQuery) {
            this.root = rql;
        }
        else {
            this.root = rql_1.RQLQuery.parse(rql_builder_1.RQL(rql));
        }
    }
    execute(qb, getColumnName) {
        return this.internalExecute(qb, { getColumnName });
    }
    internalExecute(qb, params = {}) {
        this.walk(qb, this.root, 'andWhere', params);
        return params;
    }
    walk(qb, rql, junction, params, we) {
        const currQb = we || qb;
        switch (rql.name) {
            case 'and': {
                currQb[junction](new typeorm_1.Brackets(sqb => {
                    rql.args.forEach(subRql => {
                        this.walk(qb, subRql, 'andWhere', params, sqb);
                    });
                }));
                break;
            }
            case 'or': {
                currQb[junction](new typeorm_1.Brackets(sqb => {
                    rql.args.forEach(subRql => {
                        this.walk(qb, subRql, 'orWhere', params, sqb);
                    });
                }));
                break;
            }
            case 'limit': {
                const [limit, offset] = rql.args;
                params.limit = normalizeLimitSkip(limit);
                if (offset) {
                    params.offset = normalizeLimitSkip(offset);
                }
                break;
            }
            case 'sort': {
                params.sort = {};
                rql.args.forEach(arg => {
                    let order;
                    if (arg.startsWith('+')) {
                        order = 'ASC';
                    }
                    else if (arg.startsWith('-')) {
                        order = 'DESC';
                    }
                    else {
                        throw new RqlTypeOrmError(rql, `Expected first letter of sort argument to be "+" or "-". Got "${arg}"`);
                    }
                    params.sort = params.sort || {};
                    params.sort[this.getFullColumnName(arg.substr(1), params)] = order;
                });
                break;
            }
            case 'contains':
            case 'excludes': {
                const fieldName = qb.alias + '.id';
                const [propertyPrefix, expression] = rql.args;
                if (expression instanceof rql_1.RQLQuery) {
                    const subQb = qb
                        .clone()
                        .select([fieldName])
                        .where('1=1'); // Resets where statements
                    const subRqlTypeOrm = new RqlTypeOrm(expression);
                    subRqlTypeOrm.internalExecute(subQb, {
                        getColumnName: (n) => {
                            n = `${propertyPrefix}.${n}`;
                            return params.getColumnName ? params.getColumnName(n) : n;
                        },
                    });
                    currQb[junction](`${fieldName} ${rql.name === 'contains' ? 'IN' : 'NOT IN'} (${subQb.getQuery()})`, subQb.getParameters());
                }
                else {
                    throw new RqlTypeOrmError(rql, `Expected argument 2 of ${rql.name} to be an RQL expression. Got ${expression.constructor.name}`);
                }
                break;
            }
            default: {
                const [property, value] = rql.args;
                const fieldName = this.getFullColumnName(property, params);
                const paramName = createParamName(fieldName, rql.name);
                switch (rql.name) {
                    case 'in':
                        currQb[junction](`${fieldName} IN (:...${paramName})`, {
                            [paramName]: value,
                        });
                        break;
                    case 'out':
                        currQb[junction](`${fieldName} NOT IN (:...${paramName})`, {
                            [paramName]: value,
                        });
                        break;
                    case 'eq':
                        if (value === null) {
                            currQb[junction](`${fieldName} IS NULL`, {
                                [paramName]: value,
                            });
                        }
                        else {
                            currQb[junction](`${fieldName} = :${paramName}`, {
                                [paramName]: value,
                            });
                        }
                        break;
                    case 'lt':
                        currQb[junction](`${fieldName} < :${paramName}`, {
                            [paramName]: value,
                        });
                        break;
                    case 'gt':
                        currQb[junction](`${fieldName} > :${paramName}`, {
                            [paramName]: value,
                        });
                        break;
                    case 'ge':
                        currQb[junction](`${fieldName} >= :${paramName}`, {
                            [paramName]: value,
                        });
                        break;
                    case 'le':
                        currQb[junction](`${fieldName} <= :${paramName}`, {
                            [paramName]: value,
                        });
                        break;
                    case 'ne':
                        if (value == null) {
                            currQb[junction](`${fieldName} IS NOT NULL`);
                        }
                        else {
                            currQb[junction](`${fieldName} != :${paramName}`, {
                                [paramName]: value,
                            });
                        }
                        break;
                    default:
                        throw new RqlTypeOrmError(rql, `Unexpected operator "${rql.name}"`);
                }
            }
        }
        return qb;
    }
    getFullColumnName(property, params) {
        if (params.getColumnName) {
            property = params.getColumnName(property);
        }
        const paths = property.split(/\./g);
        return paths.map(str => `\`${str}\``).join('.');
    }
}
exports.RqlTypeOrm = RqlTypeOrm;
