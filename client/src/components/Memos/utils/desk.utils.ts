import { fetchSessionStorage } from "../../../utils";
import { MemoType } from "./memo.utils";

export const getRem = (): number => {
  const htmlElement = document.documentElement;
  const computedStyle = window.getComputedStyle(htmlElement);
  const baseFontSize = computedStyle.fontSize;

  const baseFontSizeNumber = parseFloat(baseFontSize);

  return baseFontSizeNumber;
};

export const fetchDeskMemos = (memoTab: 'personal' | 'received' | 'sent' | null): MemoType[] => {
  if (!memoTab) return [];
  let memos: MemoType[];
  switch (memoTab) {
    case 'personal': {
      memos = fetchSessionStorage.memo.usersMemos();
      break;
    }
    case 'received': {
      memos = fetchSessionStorage.memo.receivedMemos();
      break;
    }
    case 'sent': {
      memos = fetchSessionStorage.memo.sentMemos();
      break;
    }
    default: {
      memos = [];
    }
  }

  return memos;
};
