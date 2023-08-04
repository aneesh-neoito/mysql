"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationSchema = void 0;
const rql_typeorm_1 = require("./rql-typeorm");
const common_1 = require("@nestjs/common");
class PaginationSchema {
    constructor(repository) {
        this.repository = repository;
        this.tablePaths = {};
        this.relations = [];
        this.qbFactory = () => void 0;
        this.fields = [];
        this.jsonFields = [];
    }
    withQuery(fn) {
        this.qbFactory = fn;
        return this;
    }
    async paginate(rql) {
        this.collectMetadata();
        const mainTableAlias = this.tablePaths[''];
        const qb = this.repository.createQueryBuilder(mainTableAlias);
        this.qbFactory(qb);
        const rqlTypeOrm = new rql_typeorm_1.RqlTypeOrm(rql);
        const { limit, offset, sort } = rqlTypeOrm.execute(qb, columnName => {
            return this.translateTableName(columnName);
        });
        const groupBy = ['id']
            .map(field => this.translateTableName(field))
            .concat(Object.keys(sort || {}));
        qb.select(this.fields).groupBy(groupBy.join(','));
        this.relations.forEach(join => {
            const fieldName = this.translateTableName(join);
            qb.leftJoin(fieldName, this.tablePaths[join]);
        });
        const count = await qb.getCount();
        if (sort) {
            qb.orderBy(sort);
        }
        if (limit !== undefined && limit !== null) {
            qb.limit(limit);
        }
        if (offset !== undefined && offset !== null) {
            qb.offset(offset);
        }
        const rows = await qb.getRawMany();
        return {
            rows: this.postProcessRows(rows),
            count,
        };
    }
    collectMetadata() {
        if (this.schema)
            return;
        const parseMetadata = (schema, metadata, prefix) => {
            metadata.columns.forEach(column => {
                const path = prefix ? `${prefix}.${column.propertyName}` : column.propertyName;
                if (!column.relationMetadata) {
                    schema[column.propertyName] = path;
                }
            });
            metadata.relations.forEach(relation => {
                const path = prefix ? `${prefix}.${relation.propertyName}` : relation.propertyName;
                if (relation.inverseEntityMetadata) {
                    if (relation.isEager) {
                        this.relations.push(path);
                        const subSchema = parseMetadata({}, relation.inverseEntityMetadata, path);
                        if (relation.isOneToOne || relation.isManyToOne) {
                            schema[relation.propertyName] = subSchema;
                        }
                        else {
                            schema[relation.propertyName] = [subSchema];
                        }
                    }
                }
            });
            return schema;
        };
        this.schema = parseMetadata({}, this.repository.metadata);
        this.buildSchema();
    }
    buildSchema() {
        this.tablePaths[''] = 'main_' + this.getTableAlias(this.repository.metadata.tableName);
        this.relations.forEach((rel, i) => {
            this.tablePaths[rel] = `rel_` + this.getTableAlias(rel);
        });
        const aliases = Object.keys(this.schema);
        this.fields = aliases.map(alias => this.buildSelectFields(this.schema[alias], true, alias));
        this.fields[0] = `DISTINCT ${this.fields[0]}`;
    }
    buildSelectFields(fields, agg = false, name) {
        if (Array.isArray(fields)) {
            const fieldsArray = this.buildSelectFields(fields[0]);
            if (agg) {
                return `CAST(CONCAT('[', COALESCE(GROUP_CONCAT(DISTINCT ${fieldsArray} SEPARATOR ','), ''), ']') AS JSON)${this.asAlias(name, true)}`;
            }
            return `JSON_ARRAY(${fieldsArray})`;
        }
        if (typeof fields === 'string') {
            return `${this.translateTableName(fields)}${this.asAlias(name)}`;
        }
        const keys = Object.keys(fields);
        const objectFields = keys
            .map(key => {
            const value = this.buildSelectFields(fields[key], agg);
            return `'${key}',${value}`;
        })
            .join(',');
        return `JSON_OBJECT(${objectFields})${this.asAlias(name, true)}`;
    }
    asAlias(name, json = false) {
        if (name && json) {
            this.jsonFields.push(name);
        }
        return name ? ` as ${name}` : '';
    }
    getTableAlias(rel) {
        return rel.replace(/\./g, '_');
    }
    translateTableName(field) {
        const paths = field.split('.');
        const name = paths.pop();
        const table = paths.join('.');
        const tableAlias = this.tablePaths[table];
        if (!tableAlias) {
            throw new common_1.BadRequestException({
                message: `Bad RQL Query: Unknown property path "${field}"`,
            });
        }
        return `${tableAlias}.${name}`;
    }
    postProcessRows(rows) {
        return rows.map(row => {
            this.jsonFields.forEach(key => {
                row[key] = JSON.parse(row[key]);
                if (Array.isArray(row[key])) {
                    row[key] = row[key].filter(val => val.id !== null);
                }
                else if (row[key].id === null) {
                    row[key] = null;
                }
            });
            return row;
        });
    }
}
exports.PaginationSchema = PaginationSchema;
