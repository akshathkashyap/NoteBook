"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const response_types_1 = require("../types/response.types");
const auth = (request, response, next) => {
    const responseObject = { message: '' };
    try {
        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            responseObject.message = 'no authentication token';
            throw new Error(responseObject.message);
        }
        const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = verifiedToken.token.userId;
        if (!userId) {
            responseObject.message = 'invalid token';
            throw new Error(responseObject.message);
        }
        response.locals.userId = userId;
        next();
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map