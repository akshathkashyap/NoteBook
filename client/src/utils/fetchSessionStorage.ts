import { MemoType } from "../components/Memos/utils";

const fetchSessionStorage = {
  memo: {
    usersMemos: () => {
      const memos: MemoType[] = JSON.parse(sessionStorage.getItem('usersMemos') ?? '[]');
      return memos;
    },
    receivedMemos: () => {
      const memos: MemoType[] = JSON.parse(sessionStorage.getItem('receivedMemos') ?? '[]');
      return memos;
    },
    sentMemos: () => {
      const memos: MemoType[] = JSON.parse(sessionStorage.getItem('sentMemos') ?? '[]');
      return memos;
    }
  }
};

export default fetchSessionStorage;