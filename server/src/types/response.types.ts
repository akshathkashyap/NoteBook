import { UserData, TopicDocument, MemoDocument } from "../models";

export enum ResponseStatusEnum {
  success = 200,
  error = 400
}

export interface ResponseType {
  message: string;
}

export interface AuthResponseType extends ResponseType {
  token: string;
}

export interface UserResponseType extends ResponseType {
  userData: Omit<UserData, 'password'> | {};
}

export interface TopicResponseType extends ResponseType {
  topic: Partial<TopicDocument>;
  topics: Partial<TopicDocument>[];
}

export interface MemoResponseType extends ResponseType {
  memo: Partial<MemoDocument>;
  memos: Partial<MemoDocument>[];
}