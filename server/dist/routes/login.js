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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import bcrypt from 'bcrypt';
const general_1 = require("../types/general");
const utils_1 = require("../utils");
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
// ROUTE /api/login
router.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '', token: '' };
    try {
        const username = request.body.username;
        const email = request.body.email;
        const password = request.body.password;
        if (username === undefined &&
            email === undefined ||
            password === undefined) {
            responseObject.message = `missing request parameters: received { username: ${username}, email: ${email}, password: ${password} }`;
            throw new mongoose_1.Error(responseObject.message);
        }
        if ((username !== undefined && !username.length) &&
            (email !== undefined && !email.length) ||
            (password !== undefined && !password.length)) {
            responseObject.message = `empty or request parameters: received { username: ${username}, email: ${email}, password: ${password} }`;
            throw new mongoose_1.Error(responseObject.message);
        }
        // fetch user id from DB
        // add code here...
        const userId = 'l7tKffqFE9zlpLF7';
        //
        const tokenData = { userId };
        responseObject.message = 'user logged in successfully';
        responseObject.token = (0, utils_1.createToken)(tokenData);
        response.status(general_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(general_1.ResponseStatusEnum.error).send(responseObject);
    }
}));
exports.default = router;
//# sourceMappingURL=login.js.map