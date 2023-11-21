import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { loginRouter, userRouter, topicRouter, memoRouter } from './routes';
import 'dotenv/config';

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);

const port: string | number = process.env.PORT ?? 8000;

const mongoUrl: string = 'mongodb://localhost:27017/notebook-db';

const startServer = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    app.use(cors());
    app.use(express.json());

    app.use('/api/login', loginRouter);
    app.use('/api/user', userRouter);
    app.use('/api/topic', topicRouter);
    app.use('/api/memo', memoRouter);

    io.on('connection', (socket) => {
      console.log('A user connected');
    });

    server.listen(port, () => {
      console.log(`Express is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

startServer();
