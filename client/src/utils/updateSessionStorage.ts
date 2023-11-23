import { MemoType } from "../components/Memos/utils";

const updateSessionStorage = {
  memo: {
    usersMemos: (memos: MemoType[]) => {
      sessionStorage.setItem('usersMemos', JSON.stringify(memos));
    },
    receivedMemos: (memos: MemoType[]) => {
      sessionStorage.setItem('receivedMemos', JSON.stringify(memos));
    },
    sentMemos: (memos: MemoType[]) => {
      sessionStorage.setItem('sentMemos', JSON.stringify(memos));
    }
  }
};

export default updateSessionStorage;