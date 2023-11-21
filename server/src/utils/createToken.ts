import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UserData } from '../models';

const createToken = (token: Omit<UserData, 'password'>): string => {
  return jwt.sign({ token }, process.env.JWT_SECRET);
};

export default createToken;
