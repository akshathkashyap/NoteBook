import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User, UserDocument, UserData, ValidUserQueryParams, ValidUserUpdateParams } from '../models';
import { ResponseType, ResponseStatusEnum, UserResponseType } from '../types/response.types';

export const getUserIdByQuery = async (query: Record<string, string>): Promise<string | null> => {
  try {
    const user = await User.findOne(query);
    if (!user) throw new Error('user not found');

    return user._id.toString();
  } catch (error) {
    console.error('Error: could not fetch user:', error.message);
    return null;
  }
};

export const getUserById = async (userId: string): Promise<UserDocument | null> => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('user not found');

    return user;
  } catch (error) {
    console.error('Error: could not fetch user:', error.message);
    return null;
  }
};

export const createUser = async (request: Request, response: Response): Promise<void> => {
  const responseObject: ResponseType = { message: '' };

  try {
    const userData: Omit<UserData, 'userId'> | undefined = request.body;
    if (!userData) {
      responseObject.message = `empty or missing request body parameters: received { userData: ${userData} }`;
      throw new Error(responseObject.message);
    }

    const { username, email, password, preferences } = userData;
    const encryptedPassword: string = await bcrypt.hash(password, 12);

    const newUser: UserDocument = new User({
      username,
      email,
      password: encryptedPassword,
      preferences,
    });

    await newUser.save();

    responseObject.message = 'user registered successfully';
    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const getUserByQuery = async (request: Request, response: Response): Promise<void> => {
  const responseObject: UserResponseType = { message: '', userData: {} };

  try {
    const query: unknown = request.query;
    const queryKeys: string[] = Object.keys(query);
    if (!queryKeys.length) {
      responseObject.message = 'no query object';
      throw new Error(responseObject.message);
    } else if (queryKeys.length !== 1) {
      responseObject.message = `can only process 1 query at a time: received ${JSON.stringify(query)}`;
      throw new Error(responseObject.message);
    } else if (!ValidUserQueryParams.includes(queryKeys[0])) {
      responseObject.message = 'invalid user query parameter';
      throw new Error(responseObject.message);
    }

    const userId: string | null = await getUserIdByQuery(query as Record<string, string>);
    if (!userId) {
      responseObject.message = 'user not found';
      throw new Error(responseObject.message);
    }

    const userDocument: UserDocument = await getUserById(userId);
    const userData: UserData = {
      userId,
      username: userDocument.username,
      email: userDocument.email,
      preferences: userDocument.preferences,
    }

    responseObject.message = 'user found';
    responseObject.userData = userData;

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const updateUserDataByParam = async (request: Request, response: Response): Promise<void> => {
  const responseObject: ResponseType = { message: '' };

  try {
    const requestParam: Partial<UserData> | {} = request.body;
    const requestParamKeys: string[] = Object.keys(requestParam);
    if (!requestParamKeys.length) {
      responseObject.message = 'no parameter provided';
      throw new Error(responseObject.message);
    } else if (requestParamKeys.length !== 1) {
      responseObject.message = 'can only update 1 parameter at a time';
      throw new Error(responseObject.message);
    } else if (!ValidUserUpdateParams.includes(requestParamKeys[0])) {
      responseObject.message = 'invalid parameter';
      throw new Error(responseObject.message);
    } else if (!requestParam[requestParamKeys[0]]) {
      responseObject.message = 'parameter value empty';
      throw new Error(responseObject.message);
    }

    const targetParam: Partial<UserData> = requestParam;
    const targetParamKey: string = requestParamKeys[0];

    const userId: string | null = response.locals.userId;
    if (!userId) {
      responseObject.message = 'session expired';
      throw new Error(responseObject.message);
    }

    const user: UserDocument | null = await getUserById(userId);
    if (!user) {
      responseObject.message = 'user not found';
      throw new Error(responseObject.message);
    }

    if (targetParamKey === 'password') {
      const encryptedPassword: string = await bcrypt.hash(targetParam.password, 12);
      user.password = encryptedPassword;
    } else {
      user[targetParamKey] = targetParam[targetParamKey];
    }
    await user.save()

    responseObject.message = 'user data updated';

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};
