import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import { ResponseStatusEnum, ResponseType } from '../types/response.types';

const auth = (request: Request, response: Response, next: NextFunction) => {
  const responseObject: ResponseType = { message: '' };

  try {
    const token: string = request.headers.authorization.split(' ')[1];

    if (!token) {
      responseObject.message = 'no authentication token';
      throw new Error(responseObject.message);
    }

    const verifiedToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const userId: string | undefined = verifiedToken.token.userId;

    if (!userId) {
      responseObject.message = 'invalid token';
      throw new Error(responseObject.message);
    }

    response.locals.userId = userId;

    next();
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export default auth;
