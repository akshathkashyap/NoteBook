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
exports.updateUserDataByParam = exports.getUserByQuery = exports.createUser = exports.getUserById = exports.getUserIdByQuery = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const response_types_1 = require("../types/response.types");
const getUserIdByQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOne(query);
        if (!user)
            throw new Error('user not found');
        return user._id.toString();
    }
    catch (error) {
        console.error('Error: could not fetch user:', error.message);
        return null;
    }
});
exports.getUserIdByQuery = getUserIdByQuery;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById(userId);
        if (!user)
            throw new Error('user not found');
        return user;
    }
    catch (error) {
        console.error('Error: could not fetch user:', error.message);
        return null;
    }
});
exports.getUserById = getUserById;
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '' };
    try {
        const userData = request.body;
        if (!userData) {
            responseObject.message = `empty or missing request body parameters: received { userData: ${userData} }`;
            throw new Error(responseObject.message);
        }
        const { username, email, password, preferences } = userData;
        const encryptedPassword = yield bcrypt_1.default.hash(password, 12);
        const newUser = new models_1.User({
            username,
            email,
            password: encryptedPassword,
            preferences,
        });
        yield newUser.save();
        responseObject.message = 'user registered successfully';
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.createUser = createUser;
const getUserByQuery = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '', userData: {} };
    try {
        const query = request.query;
        const queryKeys = Object.keys(query);
        if (!queryKeys.length) {
            responseObject.message = 'no query object';
            throw new Error(responseObject.message);
        }
        else if (queryKeys.length !== 1) {
            responseObject.message = `can only process 1 query at a time: received ${JSON.stringify(query)}`;
            throw new Error(responseObject.message);
        }
        else if (!models_1.ValidUserQueryParams.includes(queryKeys[0])) {
            responseObject.message = 'invalid user query parameter';
            throw new Error(responseObject.message);
        }
        const userId = yield (0, exports.getUserIdByQuery)(query);
        if (!userId) {
            responseObject.message = 'user not found';
            throw new Error(responseObject.message);
        }
        const userDocument = yield (0, exports.getUserById)(userId);
        const userData = {
            userId,
            username: userDocument.username,
            email: userDocument.email,
            preferences: userDocument.preferences,
        };
        responseObject.message = 'user found';
        responseObject.userData = userData;
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.getUserByQuery = getUserByQuery;
const updateUserDataByParam = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '' };
    try {
        const requestParam = request.body;
        const requestParamKeys = Object.keys(requestParam);
        if (!requestParamKeys.length) {
            responseObject.message = 'no parameter provided';
            throw new Error(responseObject.message);
        }
        else if (requestParamKeys.length !== 1) {
            responseObject.message = 'can only update 1 parameter at a time';
            throw new Error(responseObject.message);
        }
        else if (!models_1.ValidUserUpdateParams.includes(requestParamKeys[0])) {
            responseObject.message = 'invalid parameter';
            throw new Error(responseObject.message);
        }
        else if (!requestParam[requestParamKeys[0]]) {
            responseObject.message = 'parameter value empty';
            throw new Error(responseObject.message);
        }
        const targetParam = requestParam;
        const targetParamKey = requestParamKeys[0];
        const userId = response.locals.userId;
        if (!userId) {
            responseObject.message = 'session expired';
            throw new Error(responseObject.message);
        }
        const user = yield (0, exports.getUserById)(userId);
        if (!user) {
            responseObject.message = 'user not found';
            throw new Error(responseObject.message);
        }
        if (targetParamKey === 'password') {
            const encryptedPassword = yield bcrypt_1.default.hash(targetParam.password, 12);
            user.password = encryptedPassword;
        }
        else {
            user[targetParamKey] = targetParam[targetParamKey];
        }
        yield user.save();
        responseObject.message = 'user data updated';
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.updateUserDataByParam = updateUserDataByParam;
//# sourceMappingURL=user.controller.js.map