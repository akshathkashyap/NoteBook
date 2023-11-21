"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoRouter = exports.topicRouter = exports.userRouter = exports.loginRouter = void 0;
var login_routes_1 = require("./login.routes");
Object.defineProperty(exports, "loginRouter", { enumerable: true, get: function () { return __importDefault(login_routes_1).default; } });
var user_routes_1 = require("./user.routes");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(user_routes_1).default; } });
var topic_routes_1 = require("./topic.routes");
Object.defineProperty(exports, "topicRouter", { enumerable: true, get: function () { return __importDefault(topic_routes_1).default; } });
var memo_routes_1 = require("./memo.routes");
Object.defineProperty(exports, "memoRouter", { enumerable: true, get: function () { return __importDefault(memo_routes_1).default; } });
//# sourceMappingURL=index.js.map