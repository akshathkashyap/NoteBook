"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// ROUTE /api/topic
router.post('/create', middleware_1.auth, controllers_1.createTopic);
router.get('/', middleware_1.auth, controllers_1.getAuthorsTopics);
router.post('/update/name', middleware_1.auth, controllers_1.updateTopicName);
router.delete('/', middleware_1.auth, controllers_1.deleteTopic);
exports.default = router;
//# sourceMappingURL=topic.routes.js.map