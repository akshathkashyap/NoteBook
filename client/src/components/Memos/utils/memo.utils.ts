import RequestApi from "../../../lib/RequestApi";

export interface MemoType {
  id: string;
  recipients: string[];
  name: string;
  priority: number;
  updatedAt: Date;
  content: string;
}

const APIEndpoints = {
  create: '/memo/create',
  get: '/memo',
  getReceived: '/memo/received',
  update: '/memo/update',
  send: '/memo/send',
  delete: '/memo'
};

export const sortMemosList = (memos: MemoType[], direction?: 'latest-last' | 'latest-first', length?: number): MemoType[] => {
  if (length === undefined) length = memos.length;
  if (!length) return [];

  if (direction === undefined || direction === 'latest-first') {
    memos.sort((a: MemoType, b: MemoType): number => {
      const tsa: number = new Date(a.updatedAt).getTime();
      const tsb: number = new Date(b.updatedAt).getTime();
  
      return tsb - tsa;
    });
  } else if (direction === 'latest-last') {
    memos.sort((a: MemoType, b: MemoType): number => {
      const tsa: number = new Date(a.updatedAt).getTime();
      const tsb: number = new Date(b.updatedAt).getTime();
  
      return tsa - tsb;
    });
  }

  return memos.slice(0, length);
};

export const createMemo = async (): Promise<MemoType | null> => {
  const endpoint: string = APIEndpoints.create;
  const requesterApi = new RequestApi({ endpoint });
  const response: Record<string, string> | null = await requesterApi.post({ data: {} });
  if (!response) {
    console.error('failed to create new memo');
    return null;
  }

  const memo = response.memo as unknown as MemoType;

  return memo;
};

export const fetchAuthorMemos = async (): Promise<MemoType[]> => {
  const endpoint: string = APIEndpoints.get;
  const requesterApi = new RequestApi({ endpoint });
  const response: Record<string, string> | null = await requesterApi.get({ query: {} });
  if (!response) {
    console.error(`failed to fetch author's memos`);
    return [];
  }

  const memos = response.memos as unknown as MemoType[];

  return memos;
};

export const fetchAuthorsReceivedMemos = async (): Promise<MemoType[]> => {
  const endpoint: string = APIEndpoints.getReceived;
  const requesterApi = new RequestApi({ endpoint });
  const response: Record<string, string> | null = await requesterApi.get({ query: {} });
  if (!response) {
    console.error(`failed to fetch author's memos`);
    return [];
  }

  const memos = response.memos as unknown as MemoType[];

  return memos;
};

export const deleteMemo = async (memoId: string): Promise<boolean> => {
  const endpoint: string = APIEndpoints.delete;
  const requesterApi = new RequestApi({ endpoint });
  const response: Record<string, string> | null = await requesterApi.delete({ data: { id: memoId } });
  if (!response) {
    console.error(`failed to delete author's memo`);
    return false;
  }

  return true;
};