"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMemo = exports.sendMemo = exports.updateMemo = exports.getMemosSentToAuthor = exports.getAuthorsMemos = exports.createMemo = void 0;
const models_1 = require("../models");
const controllers_1 = require("../controllers");
const response_types_1 = require("../types/response.types");
const getMemoById = (memoId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memo = yield models_1.Memo.findById(memoId);
        if (!memo) {
            console.error('memo does not exist');
            return null;
        }
        return memo;
    }
    catch (error) {
        console.error('Error: could not fetch memo:', error.message);
        return null;
    }
});
const getMemosSentToAuthorId = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memos = yield models_1.Memo.find({ recipients: authorId });
        const memosList = [].concat(memos);
        return memosList;
    }
    catch (error) {
        console.error('Error: could not fetch memo:', error.message);
        return null;
    }
});
const getMemosByAuthorId = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memos = yield models_1.Memo.find({ author: authorId });
        const memosList = [].concat(memos);
        return memosList;
    }
    catch (error) {
        console.error('Error: could not fetch Memo:', error.message);
        return null;
    }
});
const createMemo = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '', memo: {} };
    try {
        const author = response.locals.userId;
        if (!author) {
            responseObject.message = 'session expired';
            throw new Error(responseObject.message);
        }
        const { name, content, priority } = request.body;
        if (!name || !content) {
            responseObject.message = `empty or missing request body parameters: received { name: ${name}, content: ${content} }`;
            throw new Error(responseObject.message);
        }
        const newMemo = new models_1.Memo({
            author,
            name,
            priority: priority ? priority : 3,
            content
        });
        yield newMemo.save();
        responseObject.message = 'memo created successfully';
        responseObject.memo = {
            id: newMemo._id,
            name,
            priority: newMemo.priority,
            updatedAt: newMemo.updatedAt,
            content
        };
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.createMemo = createMemo;
const getAuthorsMemos = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '', memos: [] };
    try {
        const author = response.locals.userId;
        if (!author) {
            responseObject.message = 'session expired';
            throw new Error(responseObject.message);
        }
        const allMemosByAuthor = yield getMemosByAuthorId(author);
        if (!allMemosByAuthor) {
            responseObject.message = `failed to fetch all memos by author`;
            throw new Error(responseObject.message);
        }
        responseObject.message = `all sent memos fetched`;
        allMemosByAuthor.forEach((memo) => {
            responseObject.memos.push({
                id: memo._id,
                recipients: memo.recipients,
                name: memo.name,
                priority: memo.priority,
                updatedAt: memo.updatedAt,
                content: memo.content
            });
        });
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.getAuthorsMemos = getAuthorsMemos;
const getMemosSentToAuthor = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '', memos: [] };
    try {
        const author = response.locals.userId;
        if (!author) {
            responseObject.message = 'session expired';
            throw new Error(responseObject.message);
        }
        const allMemosSentToAuthor = yield getMemosSentToAuthorId(author);
        if (!allMemosSentToAuthor) {
            responseObject.message = `failed to fetch all memos sent to author`;
            throw new Error(responseObject.message);
        }
        responseObject.message = `all sent memos fetched`;
        allMemosSentToAuthor.forEach((memo) => {
            responseObject.memos.push({
                id: memo._id,
                recipients: memo.recipients,
                name: memo.name,
                priority: memo.priority,
                updatedAt: memo.updatedAt,
                content: memo.content
            });
        });
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.getMemosSentToAuthor = getMemosSentToAuthor;
const updateMemo = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '' };
    try {
        const { id, name, priority, content } = request.body;
        if (!id || (!name && !content)) {
            responseObject.message = `empty or missing request body parameters: received { id: ${id}, name: ${name}, content: ${content} }`;
            throw new Error(responseObject.message);
        }
        const memo = yield getMemoById(id);
        if (!memo) {
            responseObject.message = 'memo not found';
            throw new Error(responseObject.message);
        }
        memo.name = name ? name : memo.name;
        memo.priority = priority ? priority : memo.priority;
        memo.content = content ? content : memo.content;
        memo.updatedAt = new Date();
        yield memo.save();
        responseObject.message = 'memo updated';
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.updateMemo = updateMemo;
const sendMemo = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '' };
    try {
        const { id, recipients } = request.body;
        if (!id || !recipients) {
            responseObject.message = `empty or missing request body parameters: received { id: ${id}, recipients: ${recipients} }`;
            throw new Error(responseObject.message);
        }
        const memo = yield getMemoById(id);
        if (!memo) {
            responseObject.message = 'memo not found';
            throw new Error(responseObject.message);
        }
        const validRecipients = yield Promise.all(recipients.map((userId) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, controllers_1.getUserById)(userId);
            if (!user)
                return null;
            return userId;
        })));
        const filteredValidRecipients = validRecipients.filter((recipient) => recipient !== null);
        filteredValidRecipients.forEach((recipient) => {
            memo.recipients.push(recipient);
        });
        yield memo.save();
        responseObject.message = 'memo sent';
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.sendMemo = sendMemo;
const deleteMemo = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '' };
    try {
        const { id } = request.body;
        if (!id) {
            responseObject.message = `empty or missing request body parameters: received { id: ${id} }`;
            throw new Error(responseObject.message);
        }
        const { deletedCount } = yield models_1.Memo.deleteOne({ _id: id });
        if (!deletedCount) {
            responseObject.message = `memo not found`;
            throw new Error(responseObject.message);
        }
        responseObject.message = 'memo deleted';
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.deleteMemo = deleteMemo;
//# sourceMappingURL=memo.controller.js.map