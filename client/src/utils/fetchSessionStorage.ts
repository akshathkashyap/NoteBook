import { MemoType } from "../components/Memos/utils";

const fetchSessionStorage = {
  memo: {
    usersMemos: (options?: { parse?: boolean }): string | MemoType[] => {
      const memos: string = sessionStorage.getItem('usersMemos') ?? '[]';
      if (!options?.parse) return memos;
      return JSON.parse(memos) as MemoType[];
    },
    receivedMemos: (options?: { parse?: boolean }): string | MemoType[] => {
      const memos: string = sessionStorage.getItem('receivedMemos') ?? '[]';
      if (!options?.parse) return memos;
      return JSON.parse(memos) as MemoType[];
    },
    sentMemos: (options?: { parse?: boolean }): string | MemoType[] => {
      const memos: string = sessionStorage.getItem('sentMemos') ?? '[]';
      if (!options?.parse) return memos;
      return JSON.parse(memos) as MemoType[];
    }
  }
};

export default fetchSessionStorage;