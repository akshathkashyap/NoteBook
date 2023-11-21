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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const routes_1 = require("./routes");
require("dotenv/config");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
const mongoUrl = 'mongodb://localhost:27017/notebook-db';
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(mongoUrl);
        console.log('Connected to MongoDB');
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use('/api/login', routes_1.loginRouter);
        app.use('/api/user', routes_1.userRouter);
        app.use('/api/topic', routes_1.topicRouter);
        app.use('/api/memo', routes_1.memoRouter);
        io.on('connection', (socket) => {
            console.log('A user connected');
        });
        server.listen(port, () => {
            console.log(`Express is listening at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=app.js.map