"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RQL = void 0;
function parseArg(arg) {
    switch (typeof arg) {
        case 'boolean':
            return `boolean:${arg}`;
        case 'string':
            return arg;
        case 'number':
            return `number:${arg}`;
        default:
            if (arg instanceof Date) {
                return `isodate:${arg.toISOString()}`;
            }
            else if (Array.isArray(arg)) {
                const parsed = arg.map(parseArg).join(',');
                return `(${parsed})`;
            }
            return RQL(arg);
    }
}
function RQL(json) {
    if (Array.isArray(json)) {
        return RQL({
            name: 'and',
            args: json,
        });
    }
    const args = json.args.map(arg => parseArg(arg));
    return `${json.name}(${args})`;
}
exports.RQL = RQL;
