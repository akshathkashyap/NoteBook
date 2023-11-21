import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createToken } from '../utils';
import { getUserIdByQuery, getUserById } from './user.controller';
import { AuthResponseType, ResponseStatusEnum } from '../types/response.types';
import { UserData, UserDocument } from '../models';

export const login = async (request: Request, response: Response) => {
  const responseObject: AuthResponseType = { message: '', token: '' };

  try {

    const username: string | undefined = request.body.username;
    const email: string | undefined = request.body.email;
    const password: string | undefined = request.body.password;

    if (
      username === undefined &&
      email === undefined ||
      password === undefined
    ) {
      responseObject.message = `missing request parameters: received { username: ${username}, email: ${email}, password: ${password} }`;
      throw new Error(responseObject.message);
    }

    if (
      (username !== undefined && !username.length) &&
      (email !== undefined && !email.length) ||
      (password !== undefined && !password.length)
    ) {
      responseObject.message = `empty or request parameters: received { username: ${username}, email: ${email}, password: ${password} }`;
      throw new Error(responseObject.message);
    }

    let query: Record<string, string> = {};
    if (!username) {
      query = { email };
    } else {
      query = { username };
    }

    const userId: string | null = await getUserIdByQuery(query);
    if (!userId) {
      responseObject.message = 'user not found';
      throw new Error(responseObject.message);
    }

    const user: UserDocument | null = await getUserById(userId);
    if (!user) {
      responseObject.message = 'user details not found';
      throw new Error(responseObject.message);
    }

    const passwordsDoMatch: boolean = await bcrypt.compare(password, user.password);
    if (!passwordsDoMatch) {
      responseObject.message = 'incorrect password';
      throw new Error(responseObject.message);
    }

    const token: UserData = {
      userId,
      username: user.username,
      email: user.email,
      preferences: user.preferences
    };

    responseObject.message = 'user logged in successfully';
    responseObject.token = createToken(token);

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};
