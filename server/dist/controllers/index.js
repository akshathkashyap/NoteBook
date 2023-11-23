"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMemo = exports.sendMemo = exports.updateMemo = exports.getMemosSentToAuthor = exports.getAuthorsMemos = exports.createMemo = exports.deleteTopic = exports.updateTopicName = exports.getAuthorsTopics = exports.createTopic = exports.updateUserDataByParam = exports.getUserByQuery = exports.createUser = exports.getUserById = exports.login = void 0;
var login_controller_1 = require("./login.controller");
Object.defineProperty(exports, "login", { enumerable: true, get: function () { return login_controller_1.login; } });
var user_controller_1 = require("./user.controller");
Object.defineProperty(exports, "getUserById", { enumerable: true, get: function () { return user_controller_1.getUserById; } });
Object.defineProperty(exports, "createUser", { enumerable: true, get: function () { return user_controller_1.createUser; } });
Object.defineProperty(exports, "getUserByQuery", { enumerable: true, get: function () { return user_controller_1.getUserByQuery; } });
Object.defineProperty(exports, "updateUserDataByParam", { enumerable: true, get: function () { return user_controller_1.updateUserDataByParam; } });
var topic_controller_1 = require("./topic.controller");
Object.defineProperty(exports, "createTopic", { enumerable: true, get: function () { return topic_controller_1.createTopic; } });
Object.defineProperty(exports, "getAuthorsTopics", { enumerable: true, get: function () { return topic_controller_1.getAuthorsTopics; } });
Object.defineProperty(exports, "updateTopicName", { enumerable: true, get: function () { return topic_controller_1.updateTopicName; } });
Object.defineProperty(exports, "deleteTopic", { enumerable: true, get: function () { return topic_controller_1.deleteTopic; } });
var memo_controller_1 = require("./memo.controller");
Object.defineProperty(exports, "createMemo", { enumerable: true, get: function () { return memo_controller_1.createMemo; } });
Object.defineProperty(exports, "getAuthorsMemos", { enumerable: true, get: function () { return memo_controller_1.getAuthorsMemos; } });
Object.defineProperty(exports, "getMemosSentToAuthor", { enumerable: true, get: function () { return memo_controller_1.getMemosSentToAuthor; } });
Object.defineProperty(exports, "updateMemo", { enumerable: true, get: function () { return memo_controller_1.updateMemo; } });
Object.defineProperty(exports, "sendMemo", { enumerable: true, get: function () { return memo_controller_1.sendMemo; } });
Object.defineProperty(exports, "deleteMemo", { enumerable: true, get: function () { return memo_controller_1.deleteMemo; } });
//# sourceMappingURL=index.js.map