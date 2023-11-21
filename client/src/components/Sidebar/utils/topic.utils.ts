import RequestApi from "../../../lib/RequestApi";

export interface TopicType {
  id: string;
  name: string;
  pages: string[];
}

const APIEndpoints = {
  create: '/topic/create',
  get: '/topic',
  delete: '/topic'
};

export const createTopic = async (): Promise<TopicType | null> => {
  const endpoint: string = APIEndpoints.create;
  const requesterApi = new RequestApi({ endpoint });
  const response: Record<string, string> | null = await requesterApi.post({ data: {} });
  if (!response) {
    console.error(`failed to create new topic`);
    return null;
  }

  const topic = response.topic as unknown as TopicType;

  return topic;
};

export const fetchAuthorTopics = async (): Promise<TopicType[]> => {
  const endpoint: string = APIEndpoints.get;
  const requesterApi = new RequestApi({ endpoint });
  const response: Record<string, string> | null = await requesterApi.get({ query: {} });
  if (!response) {
    console.error(`failed to fetch author's topics`);
    return [];
  }

  const topics = response.topics as unknown as TopicType[];

  return topics;
};


export const deleteTopic = async (topicId: string): Promise<boolean> => {
  const endpoint: string = APIEndpoints.delete;
  const requesterApi = new RequestApi({ endpoint });
  const response: Record<string, string> | null = await requesterApi.delete({ data: { id: topicId } });
  if (!response) {
    console.error(`failed to fetch author's topics`);
    return false;
  }

  return true;
};