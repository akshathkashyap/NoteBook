"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// ROUTE /api/user
router.post('/register', controllers_1.createUser);
router.get('/', middleware_1.auth, controllers_1.getUserByQuery);
router.post('/update', middleware_1.auth, controllers_1.updateUserDataByParam);
exports.default = router;
//# sourceMappingURL=user.routes.js.map