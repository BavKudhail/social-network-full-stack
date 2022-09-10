"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
const config = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}',
    },
    entities: [Post_1.Post],
    dbName: 'redditDB',
    user: 'postgres',
    password: '19.january',
    debug: !constants_1.__prod__,
    type: 'postgresql',
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map