"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const createToken = (token) => {
    return jsonwebtoken_1.default.sign({ token }, process.env.JWT_SECRET);
};
exports.default = createToken;
//# sourceMappingURL=createToken.js.map