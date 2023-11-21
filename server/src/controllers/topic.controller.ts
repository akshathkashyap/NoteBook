import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Topic, TopicDocument } from '../models';
import { ResponseType, ResponseStatusEnum, TopicResponseType } from '../types/response.types';

const topicByAuthorAlreadyExists = async (authorId: Types.ObjectId, topicName: string): Promise<boolean | null> => {
  try {
    const topics = await Topic.find({ author: authorId, name: topicName });
    const topicsList: TopicDocument[] = [].concat(topics);
    if (!topicsList.length) return false;

    return true;
  } catch (error) {
    console.error('Error: could not fetch topic:', error.message);
    return null;
  }
};

const getTopicById = async (topicId: Types.ObjectId): Promise<TopicDocument | null> => {
  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      console.error('topic does not exist');
      return null;
    }

    return topic;
  } catch (error) {
    console.error('Error: could not fetch topic:', error.message);
    return null;
  }
};

const getTopicsByAuthorId = async (authorId: Types.ObjectId): Promise<TopicDocument[] | null> => {
  try {
    const topics = await Topic.find({ author: authorId });
    const topicsList: TopicDocument[] = [].concat(topics);

    return topicsList;
  } catch (error) {
    console.error('Error: could not fetch topic:', error.message);
    return null;
  }
};

export const createTopic = async (request: Request, response: Response): Promise<void> => {
  const responseObject: Omit<TopicResponseType, 'topics'> = { message: '', topic: {} };

  try {
    const author = response.locals.userId as Types.ObjectId;
    if (!author) {
      responseObject.message = 'session expired';
      throw new Error(responseObject.message);
    }

    const allTopicsByAuthor: TopicDocument[] | null = await getTopicsByAuthorId(author);
    if (!allTopicsByAuthor) {
      responseObject.message = `failed to fetch all topics by author`;
      throw new Error(responseObject.message);
    }

    let highestTopicNumber: number = 0;
    allTopicsByAuthor.forEach((topic: TopicDocument) => {
      if (!topic.name.includes('Topic')) return;

      const topicNumber: number = parseInt(topic.name.split(' ')[1]);
      if (isNaN(topicNumber)) return;

      highestTopicNumber = Math.max(highestTopicNumber, topicNumber)
    })

    const name: string = `Topic ${highestTopicNumber + 1}`;

    const topicAlreadyExists: boolean | null = await topicByAuthorAlreadyExists(author, name);
    switch (topicAlreadyExists) {
      case null: {
        responseObject.message = 'failed to fetch topics';
        throw new Error(responseObject.message);
      }
      case true: {
        responseObject.message = 'topic already exists';
        throw new Error(responseObject.message);
      }
    }

    const newTopic: TopicDocument = new Topic({
      author,
      name
    });

    await newTopic.save();

    responseObject.message = 'topic created successfully';
    responseObject.topic = {
      id: newTopic._id,
      name,
      pages: newTopic.pages
    };

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const getAuthorsTopics = async (request: Request, response: Response): Promise<void> => {
  const responseObject: Omit<TopicResponseType, 'topic'> = { message: '', topics: [] };

  try {
    const author = response.locals.userId as Types.ObjectId;
    if (!author) {
      responseObject.message = 'session expired';
      throw new Error(responseObject.message);
    }

    const allTopicsByAuthor: TopicDocument[] | null = await getTopicsByAuthorId(author);
    if (!allTopicsByAuthor) {
      responseObject.message = `failed to fetch all topics by author`;
      throw new Error(responseObject.message);
    }

    responseObject.message = `all author's topics fetched`;
    allTopicsByAuthor.forEach((topic: TopicDocument) => {
      responseObject.topics.push({
        id: topic._id,
        pages: topic.pages,
        name: topic.name
      });
    });

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const updateTopicName = async (request: Request, response: Response): Promise<void> => {
  const responseObject: ResponseType  = { message: '' };

  try {
    const { id, name }: Partial<TopicDocument> = request.body;
    if (!id || !name) {
      responseObject.message = `empty or missing request body parameters: received { id: ${id}, name: ${name} }`;
      throw new Error(responseObject.message);
    }

    const author = response.locals.userId as Types.ObjectId;
    if (!author) {
      responseObject.message = 'session expired';
      throw new Error(responseObject.message);
    }
    
    const topicAlreadyExists: boolean | null = await topicByAuthorAlreadyExists(author, name);
    switch (topicAlreadyExists) {
      case null: {
        responseObject.message = 'failed to fetch topics';
        throw new Error(responseObject.message);
      }
      case true: {
        responseObject.message = 'topic already exists';
        throw new Error(responseObject.message);
      }
    }

    const topic: TopicDocument | null = await getTopicById(id);
    if (!topic) {
      responseObject.message = 'topic not found';
      throw new Error(responseObject.message);
    }

    topic.name = name;
    await topic.save()

    responseObject.message = 'topic name updated';

    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};

export const deleteTopic = async (request: Request, response: Response): Promise<void> => {
  const responseObject: ResponseType = { message: '' };

  try {
    const { id } = request.body as Types.ObjectId;
    if (!id) {
      responseObject.message = `empty or missing request body parameters: received { id: ${id} }`;
      throw new Error(responseObject.message);
    }

    const { deletedCount } = await Topic.deleteOne({ _id: id });
    if (!deletedCount) {
      responseObject.message = `topic not found`;
      throw new Error(responseObject.message);
    }

    responseObject.message = 'topic deleted';
    response.status(ResponseStatusEnum.success).send(responseObject);
  } catch (error) {
    console.error('Error: ', error.message);

    if (!responseObject.message.length) responseObject.message = error.message;

    response.status(ResponseStatusEnum.error).send(responseObject);
  }
};
