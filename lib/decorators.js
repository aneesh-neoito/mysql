"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const common_1 = require("@nestjs/common");
exports.Pagination = common_1.createParamDecorator((data, context) => {
    const req = context.switchToHttp().getRequest();
    req.query = Object.assign(Object.assign({}, req.query), { path: '//' + req.get('host') + req.path });
    return req.query;
}, [common_1.Query()]);
