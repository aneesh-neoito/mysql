"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlTestUtils = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("typeorm-transactional-cls-hooked/dist/common");
const cls_hooked_1 = require("cls-hooked");
function checkTestEnv() {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Running tests outside test env');
    }
}
exports.MysqlTestUtils = {
    deepClean(o, fs) {
        checkTestEnv();
        const set = new Set(fs);
        Object.keys(o || {}).forEach(f => {
            if (!o.hasOwnProperty(f)) {
                return;
            }
            if (set.has(f)) {
                delete o[f];
            }
            else if (typeof o[f] === 'object') {
                this.deepClean(o[f], fs);
            }
        });
    },
    deepCleanBaseEntity(o) {
        checkTestEnv();
        exports.MysqlTestUtils.deepClean(o, ['id', 'createdAt', 'updatedAt']);
    },
    getPlainObject(entity, replacer = {}) {
        checkTestEnv();
        const result = {};
        Object.keys(entity).forEach(key => {
            const value = entity[key];
            if (replacer[key] !== undefined) {
                result[key] = replacer[key];
            }
            else if (typeof value === 'object' && value !== null) {
                result[key] = this.getPlainObject(value, replacer);
            }
            else {
                result[key] = value;
            }
        });
        return result;
    },
    async cleanDB(connectionName) {
        checkTestEnv();
        const connection = typeorm_1.getConnection(connectionName);
        const entities = connection.entityMetadatas;
        for (const entity of entities) {
            const repository = await connection.getRepository(entity.name);
            try {
                await repository.query(`START TRANSACTION;`);
                await repository.query(`SET foreign_key_checks=0;`);
                await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
                await repository.query(`SET foreign_key_checks=1;`);
                await repository.query(`COMMIT;`);
            }
            catch (error) {
                await repository.query(`ROLLBACK;`);
                throw new Error(`ERROR: Cleaning test db: ${error}`);
            }
        }
    },
    runInSandbox(cb, connectionName = 'default') {
        checkTestEnv();
        return async (...args) => {
            const context = cls_hooked_1.getNamespace(common_1.NAMESPACE_NAME);
            return context === null || context === void 0 ? void 0 : context.runPromise(() => {
                const runTest = async () => {
                    try {
                        await typeorm_1.getManager().transaction(async (manager) => {
                            common_1.setEntityManagerForConnection(connectionName, context, manager);
                            const result = await cb(...args);
                            const err = new Error('FORCE_ROLLBACK_ERROR');
                            err.result = result;
                            throw err;
                        });
                    }
                    catch (err) {
                        if (err.message === 'FORCE_ROLLBACK_ERROR') {
                            return err.result;
                        }
                        console.error(err);
                        throw err;
                    }
                };
                return runTest();
            });
        };
    },
};
