import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Memo, MemoDocument, UserDocument } from '../models';
import { getUserById } from '../controllers';
import { ResponseType, ResponseStatusEnum, MemoResponseType } from '../types/response.types';

const getMemoById = async (memoId: Types.ObjectId): Promise<MemoDocument | null> => {
  try {
    const memo = await Memo.findById(memoId);
    if (!memo) {
      console.error('memo does not exist');
      return null;
    }

    return memo;
  } catch (error) {
    console.error('Error: could not fetch memo:', error.message);
    return null;
  }
};

const getMemosSentToAuthorId = async (authorId: Types.ObjectId): Promise<MemoDocument[] | null> => {
  try {
    const memos = await Memo.find({ recipients: authorId });
    const memosList: MemoDocument[] = [].concat(memos);

    return memosList;
  } catch (error) {
    console.error('Error: could not fetch memo:', error.message);
    return null;
  }
};

const getMemosByAuthorId = async (authorId: Types.ObjectId): Promise<MemoDocument[] | null> => {
  try {
    const memos = await Memo.find({ author: authorId });
    const memosList: MemoDocument[] = [].concat(memos);

    return memosList;
  } catch (error) {
    console.error('Error: could not fetch Memo:', error.message);
    return null;
  }
};

export const createMemo = async (request: Request, response: Response): Promise<void> => {
  const responseObject: Omit<MemoResponseType, 'memos'> = { message: '', memo: {} };

  try {
    const author = response.locals.userId as Types.ObjectId;
    if (!author) {
      responseObject.message = 'session expired';
      throw new Error(responseObject.message);
    }

    const { name, content, priority }: Partial<MemoDocument> = request.body;
    if (!name || !content) {
      responseObject.message = `empty or missing request body parameters: received { name: ${name}, content: ${content} }`;
      throw new Error(responseObject.message);
    }

    const newMemo: MemoDocument = new Memo({
      author,
      name,
      priority: priority ? priority : 3,
      content
    });

    await newMemo.save();

    responseObject.message = 'memo created successfully';
    responseObject.memo = {
      id: newMemo._id,
      name,
      priority: newMemo.priority,
      updatedAt: newMemo.updatedAt,
      content
    };

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const getAuthorsMemos = async (request: Request, response: Response): Promise<void> => {
  const responseObject: Omit<MemoResponseType, 'memo'> = { message: '', memos: [] };

  try {
    const author = response.locals.userId as Types.ObjectId;
    if (!author) {
      responseObject.message = 'session expired';
      throw new Error(responseObject.message);
    }

    const allMemosByAuthor: MemoDocument[] | null = await getMemosByAuthorId(author);
    if (!allMemosByAuthor) {
      responseObject.message = `failed to fetch all memos by author`;
      throw new Error(responseObject.message);
    }

    responseObject.message = `all sent memos fetched`;
    allMemosByAuthor.forEach((memo: MemoDocument) => {
      responseObject.memos.push({
        id: memo._id,
        recipients: memo.recipients,
        name: memo.name,
        priority: memo.priority,
        updatedAt: memo.updatedAt,
        content: memo.content
      });
    });

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const getMemosSentToAuthor = async (request: Request, response: Response): Promise<void> => {
  const responseObject: Omit<MemoResponseType, 'memo'> = { message: '', memos: [] };

  try {
    const author = response.locals.userId as Types.ObjectId;
    if (!author) {
      responseObject.message = 'session expired';
      throw new Error(responseObject.message);
    }

    const allMemosSentToAuthor: MemoDocument[] | null = await getMemosSentToAuthorId(author);
    if (!allMemosSentToAuthor) {
      responseObject.message = `failed to fetch all memos sent to author`;
      throw new Error(responseObject.message);
    }

    responseObject.message = `all sent memos fetched`;
    allMemosSentToAuthor.forEach((memo: MemoDocument) => {
      responseObject.memos.push({
        id: memo._id,
        recipients: memo.recipients,
        name: memo.name,
        priority: memo.priority,
        updatedAt: memo.updatedAt,
        content: memo.content
      });
    });

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const updateMemo = async (request: Request, response: Response): Promise<void> => {
  const responseObject: ResponseType  = { message: '' };

  try {
    const { id, name, priority, content }: Partial<MemoDocument> = request.body;
    if (!id || (!name && !content)) {
      responseObject.message = `empty or missing request body parameters: received { id: ${id}, name: ${name}, content: ${content} }`;
      throw new Error(responseObject.message);
    }

    const memo: MemoDocument | null = await getMemoById(id);
    if (!memo) {
      responseObject.message = 'memo not found';
      throw new Error(responseObject.message);
    }

    memo.name = name ? name : memo.name;
    memo.priority = priority ? priority : memo.priority;
    memo.content = content ? content : memo.content;
    memo.updatedAt = new Date()
    await memo.save()

    responseObject.message = 'memo updated';

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const sendMemo = async (request: Request, response: Response): Promise<void> => {
  const responseObject: ResponseType  = { message: '' };

  try {
    const { id, recipients }: Partial<MemoDocument> = request.body;
    if (!id || !recipients) {
      responseObject.message = `empty or missing request body parameters: received { id: ${id}, recipients: ${recipients} }`;
      throw new Error(responseObject.message);
    }

    const memo: MemoDocument | null = await getMemoById(id);
    if (!memo) {
      responseObject.message = 'memo not found';
      throw new Error(responseObject.message);
    }

    const validRecipients: (Types.ObjectId | null)[] = await Promise.all(recipients.map(async (userId: Types.ObjectId) => {
      const user: UserDocument | null = await getUserById(userId as unknown as string);
      if (!user) return null;
      return userId;
    }));

    const filteredValidRecipients = validRecipients.filter((recipient: Types.ObjectId | null) => recipient !== null);

    filteredValidRecipients.forEach((recipient: Types.ObjectId) => {
      memo.recipients.push(recipient);
    });

    await memo.save();

    responseObject.message = 'memo sent';

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const deleteMemo = async (request: Request, response: Response): Promise<void> => {
  const responseObject: ResponseType = { message: '' };

  try {
    const { id } = request.body as Types.ObjectId;
    if (!id) {
      responseObject.message = `empty or missing request body parameters: received { id: ${id} }`;
      throw new Error(responseObject.message);
    }

    const { deletedCount } = await Memo.deleteOne({ _id: id });
    if (!deletedCount) {
      responseObject.message = `memo not found`;
      throw new Error(responseObject.message);
    }

    responseObject.message = 'memo deleted';
    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};
