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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utils");
const user_controller_1 = require("./user.controller");
const response_types_1 = require("../types/response.types");
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '', token: '' };
    try {
        const username = request.body.username;
        const email = request.body.email;
        const password = request.body.password;
        if (username === undefined &&
            email === undefined ||
            password === undefined) {
            responseObject.message = `missing request parameters: received { username: ${username}, email: ${email}, password: ${password} }`;
            throw new Error(responseObject.message);
        }
        if ((username !== undefined && !username.length) &&
            (email !== undefined && !email.length) ||
            (password !== undefined && !password.length)) {
            responseObject.message = `empty or request parameters: received { username: ${username}, email: ${email}, password: ${password} }`;
            throw new Error(responseObject.message);
        }
        let query = {};
        if (!username) {
            query = { email };
        }
        else {
            query = { username };
        }
        const userId = yield (0, user_controller_1.getUserIdByQuery)(query);
        if (!userId) {
            responseObject.message = 'user not found';
            throw new Error(responseObject.message);
        }
        const user = yield (0, user_controller_1.getUserById)(userId);
        if (!user) {
            responseObject.message = 'user details not found';
            throw new Error(responseObject.message);
        }
        const passwordsDoMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordsDoMatch) {
            responseObject.message = 'incorrect password';
            throw new Error(responseObject.message);
        }
        const token = {
            userId,
            username: user.username,
            email: user.email,
            preferences: user.preferences
        };
        responseObject.message = 'user logged in successfully';
        responseObject.token = (0, utils_1.createToken)(token);
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.login = login;
//# sourceMappingURL=login.controller.js.map