import { fetchSessionStorage } from "../../../utils";
import { MemoType } from "./memo.utils";

export const getRem = (): number => {
  const htmlElement = document.documentElement;
  const computedStyle = window.getComputedStyle(htmlElement);
  const baseFontSize = computedStyle.fontSize;

  const baseFontSizeNumber = parseFloat(baseFontSize);

  return baseFontSizeNumber;
};

export const fetchDeskMemos = (memoTab: 'personal' | 'received' | 'sent' | null, options?: { parse?: boolean }): MemoType[] | string => {
  if (!memoTab) return [];
  let memos: MemoType[] | string;
  switch (memoTab) {
    case 'personal': {
      if (options?.parse) {
        memos = fetchSessionStorage.memo.usersMemos({ parse: true }) as MemoType[];
      } else {
        memos = fetchSessionStorage.memo.usersMemos() as string;
      }
      break;
    }
    case 'received': {
      if (options?.parse) {
        memos = fetchSessionStorage.memo.receivedMemos({ parse: true }) as MemoType[];
      } else {
        memos = fetchSessionStorage.memo.receivedMemos() as string;
      }
      break;
    }
    case 'sent': {
      if (options?.parse) {
        memos = fetchSessionStorage.memo.sentMemos({ parse: true }) as MemoType[];
      } else {
        memos = fetchSessionStorage.memo.sentMemos() as string;
      }
      break;
    }
    default: {
      if (options?.parse) {
        memos = [];
      } else {
        memos = '[]';
      }
    }
  }

  return memos;
};
