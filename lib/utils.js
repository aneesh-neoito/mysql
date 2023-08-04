"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlUtils = void 0;
const qs = require("querystring");
exports.MysqlUtils = {
    buildTypeOrmConfig(config) {
        return Object.assign(Object.assign({ charset: 'UTF8MB4_GENERAL_CI', type: 'mysql', dropSchema: false, cli: {
                entitiesDir: 'src',
                migrationsDir: 'migrations',
            } }, config), { cache: config.cache ? Object.assign(Object.assign({}, config.cache), { type: 'ioredis' }) : false, maxQueryExecutionTime: 2000 });
    },
    escapeStringForFullTextSearch(value) {
        return (value
            // "Aè".normalize('NFD') normalizes the utf-8 string into something like ["A", "e", "`"]
            .normalize('NFD')
            // Now it's trivial remove all unicode representations of accents from the string
            .replace(/[\u0300-\u036f]/g, '')
            // Then we replace by a space everything that would not be indexed by a fulltext index
            .replace(/[^a-z0-9_]+/gi, ' ')
            .trim());
    },
    createFullTextSearchParam(value) {
        return this.escapeStringForFullTextSearch(value)
            .split(/ +/)
            .filter(v => v) // Remove empty strings
            .map(v => `+${v}*`)
            .join(' ');
    },
    buildFullTextSearchQuery(queryBuilder, params) {
        var _a, _b, _c;
        if ((_a = params.query) === null || _a === void 0 ? void 0 : _a.trim()) {
            queryBuilder
                .addSelect(`MATCH(${params.field}) AGAINST (:query IN BOOLEAN MODE)`, 'score')
                .having('score > 0')
                .orderBy(`score`, 'DESC');
        }
        return queryBuilder
            .addOrderBy((_b = params.sort) !== null && _b !== void 0 ? _b : (queryBuilder.alias ? `${queryBuilder.alias}.createdAt` : 'createdAt'), (_c = params.order) !== null && _c !== void 0 ? _c : 'DESC')
            .setParameters({
            query: this.createFullTextSearchParam(params.query),
        });
    },
    prepareQueryBuilderForPagination(queryBuilder, params) {
        var _a;
        const countQueryBuilder = queryBuilder.clone();
        if ((_a = params.query) === null || _a === void 0 ? void 0 : _a.trim()) {
            countQueryBuilder
                .andWhere(`MATCH(${params.field}) AGAINST (:query IN BOOLEAN MODE) > 0`)
                .setParameters({
                query: this.createFullTextSearchParam(params.query),
            });
        }
        this.buildFullTextSearchQuery(queryBuilder, params);
        return [queryBuilder, countQueryBuilder];
    },
    formatPaginationResponse(rows, total, params) {
        const nextSkip = params.skip + params.limit;
        const previousSkip = params.skip - params.limit;
        const response = {
            rows,
            count: rows.length,
            total,
            links: {
                next: null,
                prev: null,
            },
        };
        if (nextSkip < total) {
            response.links.next = `${params.path}?${qs.stringify(Object.assign(Object.assign({}, params), { skip: nextSkip }))}`;
        }
        if (previousSkip >= 0) {
            response.links.prev = `${params.path}?${qs.stringify(Object.assign(Object.assign({}, params), { skip: previousSkip }))}`;
        }
        return response;
    },
    async paginate(qb, params) {
        var _a, _b;
        const [queryBuilder, countQueryBuilder] = this.prepareQueryBuilderForPagination(qb, params);
        queryBuilder
            .skip((_a = params.skip) !== null && _a !== void 0 ? _a : 0)
            .take((_b = params.limit) !== null && _b !== void 0 ? _b : 10);
        const [rows, total] = await Promise.all([
            queryBuilder.getMany(),
            countQueryBuilder.getCount(),
        ]);
        return this.formatPaginationResponse(rows, total, params);
    },
    reshapeToObj(obj, key, value) {
        if (value === null || value === undefined) {
            return obj;
        }
        const path = key.split('_');
        const lastPath = path.pop();
        let curr = obj;
        path.forEach(subPath => {
            curr[subPath] = curr[subPath] || {};
            curr = curr[subPath];
        });
        curr[lastPath] = value;
        return obj;
    },
    mapper(row) {
        const result = {};
        Object.keys(row).forEach(key => {
            const value = row[key];
            this.reshapeToObj(result, key, value);
        });
        return result;
    },
    async paginateRaw(qb, params, customMapper) {
        var _a, _b;
        const [queryBuilder, countQueryBuilder] = this.prepareQueryBuilderForPagination(qb, params);
        queryBuilder
            .offset((_a = params.skip) !== null && _a !== void 0 ? _a : 0)
            .limit((_b = params.limit) !== null && _b !== void 0 ? _b : 10);
        const [rows, total] = await Promise.all([
            queryBuilder.getRawMany(),
            countQueryBuilder.getCount(),
        ]);
        const result = this.formatPaginationResponse(rows, total, params);
        result.rows = result.rows.map(row => this.mapper(row));
        if (customMapper) {
            result.rows = result.rows.map(row => customMapper(row));
        }
        return result;
    },
    selectAsArrayAggregation(joinAlias, columns, asAlias = joinAlias) {
        const args = columns.map((col) => `\'${col}\', ${joinAlias}.${col}`);
        return `JSON_ARRAYAGG(IF(${joinAlias}.id IS NULL, NULL, JSON_OBJECT(${args.join(',')}))) AS JSON_AGG_${asAlias}`;
    },
    selectAsObjectAggregation(joinAlias, columns, asAlias = joinAlias) {
        const args = columns.map((col) => `\'${col}\', ${joinAlias}.${col}`);
        return `IF(${joinAlias}.id IS NULL, NULL, JSON_OBJECT(${args.join(',')})) AS JSON_AGG_${asAlias}`;
    },
};
