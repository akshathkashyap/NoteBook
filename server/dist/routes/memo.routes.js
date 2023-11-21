"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// ROUTE /api/memo
router.post('/create', middleware_1.auth, controllers_1.createMemo);
router.get('/', middleware_1.auth, controllers_1.getAuthorsMemos);
router.get('/received', middleware_1.auth, controllers_1.getMemosSentToAuthor);
router.post('/update', middleware_1.auth, controllers_1.updateMemo);
router.post('/send', middleware_1.auth, controllers_1.sendMemo);
router.delete('/', middleware_1.auth, controllers_1.deleteMemo);
exports.default = router;
//# sourceMappingURL=memo.routes.js.map